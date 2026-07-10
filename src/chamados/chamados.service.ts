import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Chamado } from './chamado.entity';
import { StatusChamado } from './enums/status-chamado';
import { PrioridadeChamado } from './enums/prioridade-chamado';
import { CriarChamadoDto } from './dto/criar-chamado.dto';
import { AtualizarChamadoDto } from './dto/atualizar-chamado.dto';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { CriarComentarioDto } from './dto/criar-comentario.dto';
import { FiltrarChamadoDto } from './dto/filtrar-chamado.dto';
import { transitar } from './chamado-state-machine';
import { Comentario } from './comentario.entity';

@Injectable()
export class ChamadosService {
  private chamados: Chamado[] = [];

  criar(dto: CriarChamadoDto): Chamado {
    const chamado: Chamado = {
      id: randomUUID(),
      titulo: dto.titulo,
      descricao: dto.descricao,
      status: StatusChamado.ABERTO,
      prioridade: dto.prioridade ?? PrioridadeChamado.MEDIA,
      solicitanteId: dto.solicitanteId,
      tecnicoId: null,
      categoriaId: dto.categoriaId,
      localId: dto.localId,
      comentarios: [],
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    this.chamados.push(chamado);
    return chamado;
  }

  listar(filtro: FiltrarChamadoDto): {
    dados: Chamado[];
    paginacao: { total: number; pagina: number; limite: number; totalPaginas: number };
  } {
    let resultado = [...this.chamados];

    if (filtro.status) {
      resultado = resultado.filter((c) => c.status === filtro.status);
    }
    if (filtro.categoriaId) {
      resultado = resultado.filter((c) => c.categoriaId === filtro.categoriaId);
    }
    if (filtro.tecnicoId) {
      resultado = resultado.filter((c) => c.tecnicoId === filtro.tecnicoId);
    }

    resultado.sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());

    const total = resultado.length;
    const pagina = filtro.pagina ?? 1;
    const limite = filtro.limite ?? 10;
    const totalPaginas = Math.ceil(total / limite);
    const inicio = (pagina - 1) * limite;
    const dados = resultado.slice(inicio, inicio + limite);

    return { dados, paginacao: { total, pagina, limite, totalPaginas } };
  }

  buscarPorId(id: string): Chamado {
    const chamado = this.chamados.find((c) => c.id === id);
    if (!chamado) throw new NotFoundException('Chamado nao encontrado');
    return chamado;
  }

  atualizar(id: string, dto: AtualizarChamadoDto): Chamado {
    const chamado = this.buscarPorId(id);
    Object.assign(chamado, dto);
    chamado.atualizadoEm = new Date();
    return chamado;
  }

  atualizarStatus(id: string, dto: AtualizarStatusDto): Chamado {
    const chamado = this.buscarPorId(id);

    try {
      transitar(chamado.status, dto.status);
    } catch (erro) {
      throw new BadRequestException(
        erro instanceof Error ? erro.message : 'Transicao invalida',
      );
    }

    if (dto.status === StatusChamado.EM_EXECUCAO && !dto.tecnicoId) {
      throw new BadRequestException(
        'Tecnico obrigatorio para executar chamado',
      );
    }

    chamado.status = dto.status;
    chamado.atualizadoEm = new Date();
    if (dto.tecnicoId) {
      chamado.tecnicoId = dto.tecnicoId;
    }
    return chamado;
  }

  adicionarComentario(chamadoId: string, dto: CriarComentarioDto): Comentario {
    const chamado = this.buscarPorId(chamadoId);
    const comentario: Comentario = {
      id: randomUUID(),
      chamadoId,
      usuarioId: dto.usuarioId,
      texto: dto.texto,
      criadoEm: new Date(),
    };
    chamado.comentarios.push(comentario);
    chamado.atualizadoEm = new Date();
    return comentario;
  }

  listarComentarios(chamadoId: string): Comentario[] {
    const chamado = this.buscarPorId(chamadoId);
    return chamado.comentarios;
  }

  remover(id: string): void {
    const index = this.chamados.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException('Chamado nao encontrado');
    this.chamados.splice(index, 1);
  }
}
