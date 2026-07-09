import { PartialType } from '@nestjs/mapped-types';
import { CriarLocalDto } from './criar-local.dto';

export class AtualizarLocalDto extends PartialType(CriarLocalDto) {}
