import { transitar } from './chamado-state-machine';
import { StatusChamado } from './enums/status-chamado';

describe('chamado-state-machine', () => {
  it('should allow ABERTO -> EM_ANALISE', () => {
    expect(() =>
      transitar(StatusChamado.ABERTO, StatusChamado.EM_ANALISE),
    ).not.toThrow();
  });

  it('should allow ABERTO -> CANCELADO', () => {
    expect(() =>
      transitar(StatusChamado.ABERTO, StatusChamado.CANCELADO),
    ).not.toThrow();
  });

  it('should not allow ABERTO -> CONCLUIDO', () => {
    expect(() =>
      transitar(StatusChamado.ABERTO, StatusChamado.CONCLUIDO),
    ).toThrow('Transicao invalida');
  });

  it('should allow EM_ANALISE -> EM_EXECUCAO', () => {
    expect(() =>
      transitar(StatusChamado.EM_ANALISE, StatusChamado.EM_EXECUCAO),
    ).not.toThrow();
  });

  it('should allow EM_EXECUCAO -> CONCLUIDO', () => {
    expect(() =>
      transitar(StatusChamado.EM_EXECUCAO, StatusChamado.CONCLUIDO),
    ).not.toThrow();
  });

  it('should not allow CONCLUIDO -> ABERTO', () => {
    expect(() =>
      transitar(StatusChamado.CONCLUIDO, StatusChamado.ABERTO),
    ).toThrow('Transicao invalida');
  });

  it('should not allow CANCELADO -> ABERTO', () => {
    expect(() =>
      transitar(StatusChamado.CANCELADO, StatusChamado.ABERTO),
    ).toThrow('Transicao invalida');
  });
});
