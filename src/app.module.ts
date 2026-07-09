import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { LocaisModule } from './locais/locais.module';
import { ChamadosModule } from './chamados/chamados.module';

@Module({
  imports: [CategoriasModule, LocaisModule, ChamadosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
