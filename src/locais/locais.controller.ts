import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocaisService } from './locais.service';
import { CriarLocalDto } from './dto/criar-local.dto';
import { AtualizarLocalDto } from './dto/atualizar-local.dto';

@Controller('locais')
export class LocaisController {
  constructor(private readonly service: LocaisService) {}

  @Post()
  criar(@Body() dto: CriarLocalDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarLocalDto,
  ) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id', ParseUUIDPipe) id: string) {
    this.service.remover(id);
  }
}
