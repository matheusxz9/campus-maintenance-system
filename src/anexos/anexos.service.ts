import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Anexo } from './anexo.entity';

@Injectable()
export class AnexosService {
  private readonly logger = new Logger(AnexosService.name);
  private anexos: Anexo[] = [];

  salvarReferenciaAnexo(
    chamadoId: string,
    nomeOriginal: string,
    caminho: string,
    tamanho: number,
    tipo: string,
  ) {
    const anexo: Anexo = {
      id: randomUUID(),
      chamadoId,
      nomeOriginal,
      caminho,
      tamanho,
      tipo,
      criadoEm: new Date(),
    };
    this.anexos.push(anexo);
    this.logger.log(`Anexo salvo para chamado ${chamadoId}: ${caminho}`);
    return anexo;
  }

  listarPorChamado(chamadoId: string): Anexo[] {
    return this.anexos.filter((a) => a.chamadoId === chamadoId);
  }
}
