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

  async buscarDadosExternos(cep: string): Promise<Record<string, unknown>> {
    try {
      const baseUrl =
        process.env.EXTERNAL_API_URL ?? 'https://viacep.com.br/ws';
      const url = `${baseUrl}/${cep}/json/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`ViaCEP respondeu com HTTP ${response.status}`);
      }
      const dados = (await response.json()) as Record<string, unknown>;
      return dados;
    } catch (error) {
      this.logger.error(
        `Falha ao consultar ViaCEP para CEP ${cep}`,
        error instanceof Error ? error.stack : undefined,
      );
      return {
        mensagem:
          'Servico externo temporariamente indisponivel. Tente novamente mais tarde.',
      };
    }
  }
}
