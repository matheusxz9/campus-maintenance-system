import { Module } from '@nestjs/common';
import { ChamadosService } from './chamados.service';
import { ChamadosController } from './chamados.controller';

@Module({
  controllers: [ChamadosController],
  providers: [ChamadosService],
})
export class ChamadosModule {}
