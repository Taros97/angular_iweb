import { Component, OnInit } from '@angular/core';
import { User , Reserva} from '@/_models';
import { USUARIO , RESERVAS} from '@/_mockups';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = USUARIO;
  reservas = RESERVAS;
  edit = false;

  constructor() { }

  ngOnInit() {
  }
}
