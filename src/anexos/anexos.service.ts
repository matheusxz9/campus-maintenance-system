import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnexosService {
  private readonly logger = new Logger(AnexosService.name);

  salvarReferenciaAnexo(chamadoId: string, caminho: string) {
    this.logger.log(`Anexo salvo para o chamado ${chamadoId}: ${caminho}`);
    return { chamadoId, caminho, mensagem: 'Anexo salvo com sucesso' };
  }

  async buscarDadosExternos(cep: string) {
    try {
      const url = `${process.env.EXTERNAL_API_URL}/${cep}/json/`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      this.logger.error(
        `Erro ao buscar dados externos para o CEP ${cep}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { mensagem: 'Serviço externo indisponível no momento' };
    }
  }
}
