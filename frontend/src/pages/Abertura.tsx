import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { USUARIO_ID } from '../config'
import type { Categoria, Local, PrioridadeChamado } from '../types'

const prioridades: { value: PrioridadeChamado; label: string }[] = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
]

export default function Abertura() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [locais, setLocais] = useState<Local[]>([])
  const [anexos, setAnexos] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState('')
  const [errosUpload, setErrosUpload] = useState<string[]>([])

  function adicionarArquivos(files: FileList) {
    setAnexos(prev => [...prev, ...Array.from(files)])
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) adicionarArquivos(e.dataTransfer.files)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) adicionarArquivos(e.target.files)
  }

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: '' as PrioridadeChamado | '',
    categoriaId: '',
    localId: '',
  })

  useEffect(() => {
    Promise.all([api.listarCategorias(), api.listarLocais()]).then(([cats, locs]) => {
      setCategorias(cats)
      setLocais(locs)
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function removerAnexo(i: number) {
    setAnexos(anexos.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setErrosUpload([])

    if (!form.titulo || !form.descricao || !form.categoriaId || !form.localId) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    setSubmitting(true)
    try {
      const chamado = await api.criarChamado({
        titulo: form.titulo,
        descricao: form.descricao,
        prioridade: form.prioridade || undefined,
        categoriaId: form.categoriaId,
        localId: form.localId,
        solicitanteId: USUARIO_ID,
      })

      const erros: string[] = []
      for (const file of anexos) {
        try {
          await api.uploadAnexo(chamado.id, file)
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Erro desconhecido'
          erros.push(`Falha ao anexar "${file.name}": ${msg}`)
        }
      }
      if (erros.length > 0) setErrosUpload(erros)

      navigate(`/chamados/${chamado.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar chamado.'
      setErro(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <h2>Abrir Chamado</h2>

      {erro && <div className="erro-box">{erro}</div>}
      {errosUpload.length > 0 && (
        <div className="erro-box">
          <strong>Erros nos anexos:</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {errosUpload.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} maxLength={120} />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição *</label>
          <textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} rows={5} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prioridade">Prioridade</label>
            <select id="prioridade" name="prioridade" value={form.prioridade} onChange={handleChange}>
              <option value="">Selecione...</option>
              {prioridades.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoriaId">Categoria *</label>
            <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange}>
              <option value="">Selecione...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="localId">Local *</label>
            <select id="localId" name="localId" value={form.localId} onChange={handleChange}>
              <option value="">Selecione...</option>
              {locais.map((l) => (
                <option key={l.id} value={l.id}>{l.campus} - {l.bloco} / {l.sala}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Anexos</label>
          <div
            className={`upload-zone${isDragging ? ' dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              hidden
            />
            <p>{isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}</p>
            <span className="upload-hint">JPEG, PNG ou PDF (máx. 5MB cada)</span>
          </div>

          {anexos.length > 0 && (
            <div className="preview-grid">
              {anexos.map((file, i) => (
                <div key={i} className="preview-card">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                  ) : (
                    <div className="preview-icon">{file.name.split('.').pop()?.toUpperCase()}</div>
                  )}
                  <div className="preview-info">
                    <span className="preview-nome" title={file.name}>{file.name}</span>
                    <span className="preview-tamanho">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button type="button" className="preview-remove" onClick={() => removerAnexo(i)} title="Remover">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Criar Chamado'}
          </button>
        </div>
      </form>
    </div>
  )
}