import { StatusChamado } from './enums/status-chamado';
import { PrioridadeChamado } from './enums/prioridade-chamado';
import { Comentario } from './comentario.entity';

export class Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  solicitanteId: string;
  tecnicoId: string | null;
  categoriaId: string;
  localId: string;
  comentarios: Comentario[];
  criadoEm: Date;
  atualizadoEm: Date;
}
