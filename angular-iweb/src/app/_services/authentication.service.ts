import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User , Role} from '@/_models';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                if (data.user && data.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    let usuario : User;
                    usuario = data.user;
                    usuario.token = data.access_token;
                    if(data.user.tipo_usuario == 0){usuario.role = Role.Admin}
                    else if(data.user.tipo_usuario == 1){usuario.role = Role.Recepcionista}
                    else if(data.user.tipo_usuario == 2){usuario.role = Role.User}

                    console.log(usuario)
                    localStorage.setItem('currentUser', JSON.stringify(usuario));
                    localStorage.setItem('token', data.user.access_token);
                    
                    this.currentUserSubject.next(data.user);
                }
                return data.user;
            }));
    }
/*
    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
            .pipe(map(user => {
                console.log(user)
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }
*/
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
