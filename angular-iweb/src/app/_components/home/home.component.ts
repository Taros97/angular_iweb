import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit {
    currentUser: User;
    images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
    constructor(
        private authenticationService: AuthenticationService,
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
    }
}
