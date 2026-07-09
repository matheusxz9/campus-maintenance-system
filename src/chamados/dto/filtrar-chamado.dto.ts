import { IsEnum, IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusChamado } from '../enums/status-chamado';

export class FiltrarChamadoDto {
  @IsEnum(StatusChamado)
  @IsOptional()
  status?: StatusChamado;

  @IsUUID()
  @IsOptional()
  categoriaId?: string;

  @IsUUID()
  @IsOptional()
  tecnicoId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  pagina?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limite?: number = 10;
}
