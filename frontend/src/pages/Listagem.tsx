import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api'
import type { Chamado, Categoria, StatusChamado, ListarChamadosResponse } from '../types'

const statusList: StatusChamado[] = ['ABERTO', 'EM_ANALISE', 'EM_EXECUCAO', 'CONCLUIDO', 'CANCELADO']

const statusLabel: Record<StatusChamado, string> = {
  ABERTO: 'Aberto',
  EM_ANALISE: 'Em Análise',
  EM_EXECUCAO: 'Em Execução',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

export default function Listagem() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [resultado, setResultado] = useState<ListarChamadosResponse | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  const filtroStatus = searchParams.get('status') || ''
  const filtroCategoria = searchParams.get('categoriaId') || ''
  const pagina = Number(searchParams.get('pagina')) || 1

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { pagina, limite: 10 }
      if (filtroStatus) params.status = filtroStatus
      if (filtroCategoria) params.categoriaId = filtroCategoria
      const [res, cats] = await Promise.all([
        api.listarChamados(params),
        api.listarCategorias(),
      ])
      setResultado(res)
      setCategorias(cats)
    } finally {
      setLoading(false)
    }
  }, [filtroStatus, filtroCategoria, pagina])

  useEffect(() => { carregar() }, [carregar])

  function setFiltro(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams)
    if (valor) params.set(chave, valor)
    else params.delete(chave)
    params.set('pagina', '1')
    setSearchParams(params)
  }

  function irParaPagina(p: number) {
    const params = new URLSearchParams(searchParams)
    params.set('pagina', String(p))
    setSearchParams(params)
  }

  return (
    <div className="listagem">
      <div className="page-header">
        <h2>Chamados</h2>
        <Link to="/abrir" className="btn btn-primary">Novo Chamado</Link>
      </div>

      <div className="filtros">
        <select value={filtroStatus} onChange={(e) => setFiltro('status', e.target.value)}>
          <option value="">Todos os status</option>
          {statusList.map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>

        <select value={filtroCategoria} onChange={(e) => setFiltro('categoriaId', e.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : resultado && resultado.dados.length === 0 ? (
        <div className="empty">Nenhum chamado encontrado.</div>
      ) : (
        <>
          <div className="tabela-chamados">
            <div className="tabela-header">
              <span className="col-titulo">Título</span>
              <span className="col-status">Status</span>
              <span className="col-prioridade">Prioridade</span>
              <span className="col-data">Criado em</span>
            </div>
            {resultado?.dados.map((chamado: Chamado) => (
              <Link to={`/chamados/${chamado.id}`} key={chamado.id} className="tabela-linha">
                <span className="col-titulo">{chamado.titulo}</span>
                <span className="col-status">
                  <span className={`status-badge status-${chamado.status.toLowerCase()}`}>
                    {statusLabel[chamado.status]}
                  </span>
                </span>
                <span className="col-prioridade">{chamado.prioridade}</span>
                <span className="col-data">{new Date(chamado.criadoEm).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>

          {resultado && resultado.paginacao.totalPaginas > 1 && (
            <div className="paginacao">
              <button
                disabled={pagina <= 1}
                onClick={() => irParaPagina(pagina - 1)}
                className="btn btn-outline"
              >
                Anterior
              </button>
              <span>Página {resultado.paginacao.pagina} de {resultado.paginacao.totalPaginas}</span>
              <button
                disabled={pagina >= resultado.paginacao.totalPaginas}
                onClick={() => irParaPagina(pagina + 1)}
                className="btn btn-outline"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}