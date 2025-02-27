import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role } from '@/_models';


const users: User[] = [
    { email: 'admin@a.com', nombre: 'Pepo', apellidos: 'Paco', telefono: '000000000', 
    direccion: 'Calle Falsa 123', password: '123456', dni: '123456789Z', nacionalidad: 'Atlantico', role: Role.Admin, token: ''},
    { email: 'user@a.com', nombre: 'Pepi', apellidos: 'Paco', telefono: '000000000', 
    direccion: 'Calle Falsa 123', password: '123456', dni: '123456789Z', nacionalidad: 'Atlantico', role: Role.User, token: ''},
    { email: 'recep@a.com', nombre: 'Pepa', apellidos: 'Paco', telefono: '000000000', 
    direccion: 'Calle Falsa 123', password: '123456', dni: '123456789Z', nacionalidad: 'Atlantico', role: Role.Recepcionista, token: ''},
]


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);

            if (!user) return error('email or password is incorrect');
            return ok({
                email: user.email,
                nombre: user.nombre,
                apellidos: user.apellidos,
                role: user.role,
                token: `fake-jwt-token.${user.email}`,
                telefono: user.telefono,
                direccion: user.direccion,
                dni: user.dni,
                nacionalidad: user.nacionalidad,
            });
        }

        function register() {
            const user = body

            if (users.find(x => x.email === user.email)) {
                return error('Email "' + user.email + '" is already taken')
            }
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok("ok");
        }


        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser().email !== emailFromUrl()) return unauthorized();

            const user = users.find(x => x.email === emailFromUrl());
            return ok(user);
        }

        // helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser().role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const email = headers.get('Authorization').split('.')[1];
            return users.find(x => x.email === email);
        }

        function emailFromUrl() {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};