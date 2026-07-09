import { StatusChamado } from './enums/status-chamado';

const transicoes: Record<StatusChamado, StatusChamado[]> = {
  [StatusChamado.ABERTO]: [StatusChamado.EM_ANALISE, StatusChamado.CANCELADO],
  [StatusChamado.EM_ANALISE]: [
    StatusChamado.EM_EXECUCAO,
    StatusChamado.CANCELADO,
  ],
  [StatusChamado.EM_EXECUCAO]: [
    StatusChamado.CONCLUIDO,
    StatusChamado.CANCELADO,
  ],
  [StatusChamado.CONCLUIDO]: [],
  [StatusChamado.CANCELADO]: [],
};

export function transitar(origem: StatusChamado, destino: StatusChamado): void {
  const permitidos = transicoes[origem];
  if (!permitidos.includes(destino)) {
    throw new Error(
      `Transicao invalida: ${origem} -> ${destino}. Transicoes permitidas: ${permitidos.join(', ') || 'nenhuma'}`,
    );
  }
}
