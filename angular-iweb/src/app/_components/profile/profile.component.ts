import { Component, OnInit } from '@angular/core';
import { User } from '@/_models';
import { USUARIO } from '@/_mockups';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = USUARIO;

  constructor() { }

  ngOnInit() {
  }



}
