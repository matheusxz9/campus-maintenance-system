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

  it('should allow CONCLUIDO -> ABERTO (reabrir)', () => {
    expect(() =>
      transitar(StatusChamado.CONCLUIDO, StatusChamado.ABERTO),
    ).not.toThrow();
  });

  it('should allow CANCELADO -> ABERTO (reabrir)', () => {
    expect(() =>
      transitar(StatusChamado.CANCELADO, StatusChamado.ABERTO),
    ).not.toThrow();
  });
});
