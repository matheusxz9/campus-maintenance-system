import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CriarComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'Texto e obrigatorio' })
  texto: string;

  @IsUUID()
  usuarioId: string;
}
