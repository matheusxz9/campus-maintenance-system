import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { USUARIO_ID } from '../config'
import { useToast } from '../context/ToastContext'
import type { Anexo, Chamado, Comentario, StatusChamado } from '../types'

const statusList: StatusChamado[] = ['ABERTO', 'EM_ANALISE', 'EM_EXECUCAO', 'CONCLUIDO', 'CANCELADO']

const statusLabel: Record<StatusChamado, string> = {
  ABERTO: 'Aberto',
  EM_ANALISE: 'Em Análise',
  EM_EXECUCAO: 'Em Execução',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

export default function Detalhes() {
  const { id } = useParams<{ id: string }>()
  const { addToast } = useToast()
  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [anexos, setAnexos] = useState<Anexo[]>([])
  const [novoComentario, setNovoComentario] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([api.buscarChamado(id), api.listarComentarios(id), api.listarAnexos(id)])
      .then(([c, cm, an]) => {
        setChamado(c)
        setComentarios(cm)
        setAnexos(an)
      })
      .catch(() => setErro('Chamado não encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleMudarStatus(novoStatus: StatusChamado) {
    if (!id || !chamado) return
    try {
      const atualizado = await api.atualizarStatus(id, { status: novoStatus })
      setChamado(atualizado)
      addToast(`Status alterado para ${statusLabel[novoStatus]}`)
    } catch {
      addToast('Transição de status inválida.', 'error')
    }
  }

  async function handleAdicionarComentario(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !novoComentario.trim()) return
    try {
      const comentario = await api.adicionarComentario(id, {
        texto: novoComentario,
        usuarioId: USUARIO_ID,
      })
      setComentarios([...comentarios, comentario])
      setNovoComentario('')
      addToast('Comentário adicionado.')
    } catch {
      addToast('Erro ao adicionar comentário.', 'error')
    }
  }

  const transicoes: Record<StatusChamado, StatusChamado[]> = {
    ABERTO: ['EM_ANALISE', 'CANCELADO'],
    EM_ANALISE: ['EM_EXECUCAO', 'CANCELADO'],
    EM_EXECUCAO: ['CONCLUIDO', 'CANCELADO'],
    CONCLUIDO: ['ABERTO'],
    CANCELADO: ['ABERTO'],
  }

  if (loading) return <div className="loading">Carregando...</div>
  if (erro || !chamado) return <div className="erro-box">Chamado não encontrado. <Link to="/">Voltar</Link></div>

  return (
    <div className="detalhes">
      <Link to="/" className="btn btn-outline voltar">Voltar</Link>

      <div className="detalhes-header">
        <h2>{chamado.titulo}</h2>
        <span className={`status-badge status-${chamado.status.toLowerCase()}`}>
          {statusLabel[chamado.status]}
        </span>
      </div>

      <div className="detalhes-info">
        <div className="info-grid">
          <div><strong>Prioridade:</strong> {chamado.prioridade}</div>
          <div><strong>Solicitante:</strong> {chamado.solicitanteId}</div>
          <div><strong>Técnico:</strong> {chamado.tecnicoId || 'Não atribuído'}</div>
          <div><strong>Categoria ID:</strong> {chamado.categoriaId}</div>
          <div><strong>Local ID:</strong> {chamado.localId}</div>
          <div><strong>Criado em:</strong> {new Date(chamado.criadoEm).toLocaleString()}</div>
        </div>
        <div className="detalhes-descricao">
          <h3>Descrição</h3>
          <p>{chamado.descricao}</p>
        </div>
      </div>

      <div className="detalhes-status">
        <h3>Alterar Status</h3>
        <div className="status-acoes">
          {statusList
            .filter((s) => transicoes[chamado.status]?.includes(s))
            .map((s) => (
              <button key={s} className="btn btn-outline" onClick={() => handleMudarStatus(s)}>
                {statusLabel[s]}
              </button>
            ))}
        </div>
      </div>

      <div className="detalhes-anexos">
        <h3>Anexos ({anexos.length})</h3>

        <ul className="anexos-lista">
          {anexos.length === 0 && <li className="empty">Nenhum anexo ainda.</li>}
          {anexos.map((a) => (
            <li key={a.id}>
              <a href={`/uploads/${a.caminho.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
                {a.nomeOriginal}
              </a>
              <span className="anexo-tamanho"> ({(a.tamanho / 1024).toFixed(1)} KB)</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="detalhes-comentarios">
        <h3>Comentários ({comentarios.length})</h3>

        <ul className="comentarios-lista">
          {comentarios.length === 0 && <li className="empty">Nenhum comentário ainda.</li>}
          {comentarios.map((c) => (
            <li key={c.id} className="comentario-item">
              <div className="comentario-meta">
                <strong>{c.usuarioId}</strong>
                <span>{new Date(c.criadoEm).toLocaleString()}</span>
              </div>
              <p>{c.texto}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdicionarComentario} className="comentario-form">
          <textarea
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Adicionar comentário..."
            rows={3}
          />
          <button type="submit" className="btn btn-primary" disabled={!novoComentario.trim()}>
            Comentar
          </button>
        </form>
      </div>
    </div>
  )
}