import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TarefasModule } from './tarefas/tarefas.module';
import { ChamadosModule } from './chamados/chamados.module';

@Module({
  imports: [TarefasModule, ChamadosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
