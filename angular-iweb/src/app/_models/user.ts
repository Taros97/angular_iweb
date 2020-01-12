import { Role } from "./role"

export class User {
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  password: string;
  dni: string;
  nacionalidad: string;
  role: Role;
  token: string;
}
