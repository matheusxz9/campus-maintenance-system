import axios from 'axios'
import type {
  Chamado,
  Categoria,
  Local,
  Comentario,
  CriarChamadoPayload,
  AtualizarStatusPayload,
  ListarChamadosResponse,
} from './types'

const http = axios.create({ baseURL: '/api' })

export const api = {
  // ----- Chamados -----
  listarChamados(params?: {
    status?: string
    categoriaId?: string
    tecnicoId?: string
    pagina?: number
    limite?: number
  }): Promise<ListarChamadosResponse> {
    return http.get('/chamados', { params }).then((r) => r.data)
  },

  buscarChamado(id: string): Promise<Chamado> {
    return http.get(`/chamados/${id}`).then((r) => r.data)
  },

  criarChamado(payload: CriarChamadoPayload): Promise<Chamado> {
    return http.post('/chamados', payload).then((r) => r.data)
  },

  atualizarStatus(id: string, payload: AtualizarStatusPayload): Promise<Chamado> {
    return http.patch(`/chamados/${id}/status`, payload).then((r) => r.data)
  },

  atualizarChamado(id: string, payload: Partial<CriarChamadoPayload>): Promise<Chamado> {
    return http.patch(`/chamados/${id}`, payload).then((r) => r.data)
  },

  removerChamado(id: string): Promise<void> {
    return http.delete(`/chamados/${id}`)
  },

  // ----- Comentarios -----
  listarComentarios(chamadoId: string): Promise<Comentario[]> {
    return http.get(`/chamados/${chamadoId}/comentarios`).then((r) => r.data)
  },

  adicionarComentario(chamadoId: string, payload: { texto: string; usuarioId: string }): Promise<Comentario> {
    return http.post(`/chamados/${chamadoId}/comentarios`, payload).then((r) => r.data)
  },

  // ----- Categorias -----
  listarCategorias(): Promise<Categoria[]> {
    return http.get('/categorias').then((r) => r.data)
  },

  // ----- Locais -----
  listarLocais(): Promise<Local[]> {
    return http.get('/locais').then((r) => r.data)
  },

  // ----- Anexos (fake upload) -----
  async uploadAnexo(file: File): Promise<{ url: string; nome: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post('/upload', formData)
    return data
  },
}