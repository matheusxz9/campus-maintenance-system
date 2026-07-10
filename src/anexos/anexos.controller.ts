import { FileValidator } from '@nestjs/common';
import { diskStorage } from 'multer';
import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { AnexosService } from './anexos.service';

class TipoArquivoValidator extends FileValidator {
  private readonly tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];

  isValid(file: Express.Multer.File): boolean {
    return this.tiposPermitidos.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `Tipo de arquivo invalido. Permitidos: ${this.tiposPermitidos.join(', ')}`;
  }
}

@Controller('chamados')
export class AnexosController {
  constructor(private readonly anexosService: AnexosService) {}

  @Post(':id/anexos')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH ?? './uploads',
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
    }),
  )
  upload(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new TipoArquivoValidator({}),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.anexosService.salvarReferenciaAnexo(
      id,
      file.originalname,
      file.path,
      file.size,
      file.mimetype,
    );
  }

  @Get(':id/anexos')
  listar(@Param('id', ParseUUIDPipe) id: string) {
    return this.anexosService.listarPorChamado(id);
  }
}
