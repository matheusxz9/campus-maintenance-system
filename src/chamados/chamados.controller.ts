import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ChamadosService } from './chamados.service';
import { CriarChamadoDto } from './dto/criar-chamado.dto';
import { AtualizarChamadoDto } from './dto/atualizar-chamado.dto';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { CriarComentarioDto } from './dto/criar-comentario.dto';
import { FiltrarChamadoDto } from './dto/filtrar-chamado.dto';

@Controller('chamados')
export class ChamadosController {
  constructor(private readonly service: ChamadosService) {}

  @Post()
  criar(@Body() dto: CriarChamadoDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar(@Query() filtro: FiltrarChamadoDto) {
    return this.service.listar(filtro);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarChamadoDto,
  ) {
    return this.service.atualizar(id, dto);
  }

  @Patch(':id/status')
  atualizarStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarStatusDto,
  ) {
    return this.service.atualizarStatus(id, dto);
  }

  @Post(':id/comentarios')
  adicionarComentario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CriarComentarioDto,
  ) {
    return this.service.adicionarComentario(id, dto);
  }

  @Get(':id/comentarios')
  listarComentarios(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarComentarios(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id', ParseUUIDPipe) id: string) {
    this.service.remover(id);
  }
}
