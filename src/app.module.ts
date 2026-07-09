import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { LocaisModule } from './locais/locais.module';

@Module({
  imports: [CategoriasModule, LocaisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
