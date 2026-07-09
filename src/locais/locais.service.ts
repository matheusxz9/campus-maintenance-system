import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Local } from './local.entity';
import { CriarLocalDto } from './dto/criar-local.dto';
import { AtualizarLocalDto } from './dto/atualizar-local.dto';

@Injectable()
export class LocaisService {
  private locais: Local[] = [];

  criar(dto: CriarLocalDto): Local {
    const local = {
      id: randomUUID(),
      bloco: dto.bloco,
      sala: dto.sala,
      campus: dto.campus,
      criadoEm: new Date(),
    };
    this.locais.push(local);
    return local;
  }

  listar(): Local[] {
    return this.locais;
  }

  buscarPorId(id: string): Local {
    const local = this.locais.find((l) => l.id === id);
    if (!local) throw new NotFoundException('Local nao encontrado');
    return local;
  }

  atualizar(id: string, dto: AtualizarLocalDto): Local {
    const local = this.buscarPorId(id);
    Object.assign(local, dto);
    return local;
  }

  remover(id: string): void {
    const index = this.locais.findIndex((l) => l.id === id);
    if (index === -1) throw new NotFoundException('Local nao encontrado');
    this.locais.splice(index, 1);
  }
}
