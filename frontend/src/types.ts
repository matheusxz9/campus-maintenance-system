export type StatusChamado = 'ABERTO' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'CANCELADO'
export type PrioridadeChamado = 'BAIXA' | 'MEDIA' | 'ALTA'

export interface Chamado {
  id: string
  titulo: string
  descricao: string
  status: StatusChamado
  prioridade: PrioridadeChamado
  solicitanteId: string
  tecnicoId: string | null
  categoriaId: string
  localId: string
  comentarios: Comentario[]
  criadoEm: string
  atualizadoEm: string
}

export interface Comentario {
  id: string
  chamadoId: string
  usuarioId: string
  texto: string
  criadoEm: string
}

export interface Categoria {
  id: string
  nome: string
  descricao?: string
  criadoEm: string
}

export interface Local {
  id: string
  bloco: string
  sala: string
  campus: string
  criadoEm: string
}

export interface Paginacao {
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

export interface ListarChamadosResponse {
  dados: Chamado[]
  paginacao: Paginacao
}

export interface CriarChamadoPayload {
  titulo: string
  descricao: string
  prioridade?: PrioridadeChamado
  categoriaId: string
  localId: string
  solicitanteId: string
}

export interface Anexo {
  id: string
  chamadoId: string
  nomeOriginal: string
  caminho: string
  tamanho: number
  tipo: string
  criadoEm: string
}

export interface AtualizarStatusPayload {
  status: StatusChamado
  tecnicoId?: string
}