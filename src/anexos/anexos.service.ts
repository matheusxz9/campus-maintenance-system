import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnexosService {
  private readonly logger = new Logger(AnexosService.name);

  salvarReferenciaAnexo(chamadoId: string, caminho: string) {
    this.logger.log(`Anexo salvo para chamado ${chamadoId}: ${caminho}`);
    return { chamadoId, caminho, mensagem: 'Anexo salvo com sucesso' };
  }

  async buscarDadosExternos(cep: string) {
    try {
      const baseUrl = process.env.EXTERNAL_API_URL ?? 'https://viacep.com.br/ws';
      const url = `${baseUrl}/${cep}/json/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`ViaCEP respondeu com HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.logger.error(
        `Falha ao consultar ViaCEP para CEP ${cep}`,
        error instanceof Error ? error.stack : undefined,
      );
      return {
        mensagem: 'Servico externo temporariamente indisponivel. Tente novamente mais tarde.',
      };
    }
  }
}
