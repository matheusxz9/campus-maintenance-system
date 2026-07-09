import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Local } from './local.entity';
import { CriarLocalDto } from './dto/criar-local.dto';
import { AtualizarLocalDto } from './dto/atualizar-local.dto';

@Injectable()
export class LocaisService {
  private locais: Local[] = [
    { id: randomUUID(), bloco: 'A', sala: '101', campus: 'Campus Central', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'A', sala: '102', campus: 'Campus Central', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'B', sala: '201', campus: 'Campus Central', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'B', sala: '202', campus: 'Campus Central', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'Principal', sala: '1', campus: 'Campus Norte', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'Principal', sala: '2', campus: 'Campus Norte', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'Administrativo', sala: '1', campus: 'Campus Sul', criadoEm: new Date() },
    { id: randomUUID(), bloco: 'Administrativo', sala: '2', campus: 'Campus Sul', criadoEm: new Date() },
  ];

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
