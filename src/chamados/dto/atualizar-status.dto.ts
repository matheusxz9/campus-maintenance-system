import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { StatusChamado } from '../enums/status-chamado';

export class AtualizarStatusDto {
  @IsEnum(StatusChamado)
  status: StatusChamado;

  @IsUUID()
  @IsOptional()
  tecnicoId?: string;
}
