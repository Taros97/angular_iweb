import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User , Role } from './_models';

import './_content/app.less';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' , styleUrls: ['./app.component.css'] })
export class AppComponent {
    currentUser: User;

    admin : Role =  Role.Admin;
    recepcionista : Role =  Role.Recepcionista;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
