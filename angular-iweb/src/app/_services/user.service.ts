import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, UsuarioReserva } from '@/_models';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

    // Esto realmente deneria de llamar a config.apiUrl pero como somos idiotas no nos funciona y tenemos que hace esto
    private configapiUrl = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    register(user: UsuarioReserva) {
        return this.http.post(`${environment.apiUrl}/registro`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}
