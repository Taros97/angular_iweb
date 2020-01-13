import { ReservaFinal, Sala, User, Habitacion } from '@/_models';
import { HABITACIONES } from './mock-habitaciones';
import { SALAS } from './mock-salas';
import { USUARIO, USUARIO2 } from './mock-usuario';

export const RESERVASFINAL: ReservaFinal[] =[
  {codigo: 1, fechaInicio: new Date('2019-05-01'), fechaFin: new Date('2017-11-11'), descripcion: 'descripcion 1asdfasdfasdfasdfasdfasdfasdfasdfads asdf asdf sdf sd fsdfsdfasdfasdadfdsf', tipo: 'Teléfono', habitacion: HABITACIONES[0], sala: null, usuario: USUARIO},
  {codigo: 2, fechaInicio: new Date('2017-05-01'), fechaFin: new Date('2017-11-11'), descripcion: 'descripcion 2', tipo: 'Mostrador', habitacion: null, sala: SALAS[0], usuario: USUARIO2},
  {codigo: 3, fechaInicio: new Date('2017-05-01'), fechaFin: new Date('2017-11-11'), descripcion: 'descripcion 3', tipo: 'Bloqueada', habitacion: HABITACIONES[1], sala: null, usuario: USUARIO},
  {codigo: 4, fechaInicio: new Date('2017-05-01'), fechaFin: new Date('2017-11-11'), descripcion: 'descripcion 4', tipo: 'Paguina Web', habitacion: HABITACIONES[0], sala: null, usuario: USUARIO},
]
