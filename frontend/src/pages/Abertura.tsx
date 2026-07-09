import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { Categoria, Local, PrioridadeChamado } from '../types'

const prioridades: { value: PrioridadeChamado; label: string }[] = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
]

export default function Abertura() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [locais, setLocais] = useState<Local[]>([])
  const [anexos, setAnexos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: '' as PrioridadeChamado | '',
    categoriaId: '',
    localId: '',
    solicitanteId: '',
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setAnexos(Array.from(e.target.files))
  }

  function removerAnexo(i: number) {
    setAnexos(anexos.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!form.titulo || !form.descricao || !form.categoriaId || !form.localId || !form.solicitanteId) {
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
        solicitanteId: form.solicitanteId,
      })

      for (const file of anexos) {
        try {
          await api.uploadAnexo(file)
        } catch {
          // se nao tiver upload implantado, ignora
        }
      }

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
          <label htmlFor="solicitanteId">ID do Solicitante *</label>
          <input id="solicitanteId" name="solicitanteId" value={form.solicitanteId} onChange={handleChange} placeholder="UUID do solicitante" />
        </div>

        <div className="form-group">
          <label>Anexos</label>
          <input type="file" multiple onChange={handleFileChange} className="file-input" />
          {anexos.length > 0 && (
            <ul className="anexos-lista">
              {anexos.map((file, i) => (
                <li key={i}>
                  {file.name}
                  <button type="button" className="btn-link" onClick={() => removerAnexo(i)}>Remover</button>
                </li>
              ))}
            </ul>
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