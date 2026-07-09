import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CriarCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome e obrigatorio' })
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
