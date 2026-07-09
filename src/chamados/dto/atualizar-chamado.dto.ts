import { PartialType } from '@nestjs/mapped-types';
import { CriarChamadoDto } from './criar-chamado.dto';

export class AtualizarChamadoDto extends PartialType(CriarChamadoDto) {}
