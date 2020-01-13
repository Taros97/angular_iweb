import { Habitacion } from './habitacion'
import { Sala } from './sala'
import { User } from './user'

export class ReservaFinal {
  codigo: number;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion: string;
  tipo: string;
  habitacion: Habitacion;
  sala: Sala;
  usuario: User;
}
