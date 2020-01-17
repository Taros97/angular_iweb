import { Role } from "./role"

export class UsuarioReserva {
  email: string;
  name: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  password: string;
  dni: string;
  nacionalidad: string;
  role: Role;
  token: string;
  tipo_usuario: number;
}