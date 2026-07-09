import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Categoria } from './categoria.entity';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';

@Injectable()
export class CategoriasService {
  private categorias: Categoria[] = [];

  criar(dto: CriarCategoriaDto): Categoria {
    const categoria = {
      id: randomUUID(),
      nome: dto.nome,
      descricao: dto.descricao,
      criadoEm: new Date(),
    };
    this.categorias.push(categoria);
    return categoria;
  }

  listar(): Categoria[] {
    return this.categorias;
  }

  buscarPorId(id: string): Categoria {
    const categoria = this.categorias.find((c) => c.id === id);
    if (!categoria) throw new NotFoundException('Categoria nao encontrada');
    return categoria;
  }

  atualizar(id: string, dto: AtualizarCategoriaDto): Categoria {
    const categoria = this.buscarPorId(id);
    Object.assign(categoria, dto);
    return categoria;
  }

  remover(id: string): void {
    const index = this.categorias.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException('Categoria nao encontrada');
    this.categorias.splice(index, 1);
  }
}
