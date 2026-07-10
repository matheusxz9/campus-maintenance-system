import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { LocaisModule } from './locais/locais.module';
import { ChamadosModule } from './chamados/chamados.module';
import { AnexosModule } from './anexos/anexos.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CategoriasModule, LocaisModule, ChamadosModule, AnexosModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
