import { IsString, IsNotEmpty } from 'class-validator';

export class CriarLocalDto {
  @IsString()
  @IsNotEmpty({ message: 'Bloco e obrigatorio' })
  bloco: string;

  @IsString()
  @IsNotEmpty({ message: 'Sala e obrigatoria' })
  sala: string;

  @IsString()
  @IsNotEmpty({ message: 'Campus e obrigatorio' })
  campus: string;
}
