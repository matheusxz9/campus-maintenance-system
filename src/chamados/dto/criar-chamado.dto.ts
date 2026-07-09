import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PrioridadeChamado } from '../enums/prioridade-chamado';

export class CriarChamadoDto {
  @IsString()
  @IsNotEmpty({ message: 'Titulo e obrigatorio' })
  @MaxLength(120)
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'Descricao e obrigatoria' })
  descricao: string;

  @IsEnum(PrioridadeChamado)
  @IsOptional()
  prioridade?: PrioridadeChamado;

  @IsUUID()
  @IsNotEmpty({ message: 'Categoria e obrigatoria' })
  categoriaId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Local e obrigatorio' })
  localId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Solicitante e obrigatorio' })
  solicitanteId: string;
}
