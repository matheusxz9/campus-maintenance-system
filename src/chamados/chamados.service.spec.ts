import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ChamadosService } from './chamados.service';
import { StatusChamado } from './enums/status-chamado';

describe('ChamadosService', () => {
  let service: ChamadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChamadosService],
    }).compile();

    service = module.get<ChamadosService>(ChamadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('atualizarStatus', () => {
    let chamadoId: string;

    beforeEach(() => {
      const chamado = service.criar({
        titulo: 'Teste',
        descricao: 'Descricao',
        categoriaId: '00000000-0000-0000-0000-000000000001',
        localId: '00000000-0000-0000-0000-000000000002',
        solicitanteId: '00000000-0000-0000-0000-000000000003',
      });
      chamadoId = chamado.id;
    });

    it('deve lancar BadRequest ao pular etapas (ABERTO -> CONCLUIDO)', () => {
      expect(() =>
        service.atualizarStatus(chamadoId, {
          status: StatusChamado.CONCLUIDO,
        }),
      ).toThrow(BadRequestException);
    });

    it('deve lancar BadRequest ao ir para EM_EXECUCAO sem tecnicoId', () => {
      service.atualizarStatus(chamadoId, {
        status: StatusChamado.EM_ANALISE,
      });

      expect(() =>
        service.atualizarStatus(chamadoId, {
          status: StatusChamado.EM_EXECUCAO,
        }),
      ).toThrow(BadRequestException);
    });

    it('deve permitir EM_EXECUCAO com tecnicoId', () => {
      service.atualizarStatus(chamadoId, {
        status: StatusChamado.EM_ANALISE,
      });

      const resultado = service.atualizarStatus(chamadoId, {
        status: StatusChamado.EM_EXECUCAO,
        tecnicoId: '00000000-0000-0000-0000-000000000099',
      });

      expect(resultado.status).toBe(StatusChamado.EM_EXECUCAO);
      expect(resultado.tecnicoId).toBe(
        '00000000-0000-0000-0000-000000000099',
      );
    });
  });
});
