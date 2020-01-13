import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reserva-cliente',
  templateUrl: './reserva-cliente.component.html',
  styleUrls: ['./reserva-cliente.component.css']
})
export class ReservaClienteComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  reservas = [new Date(2020,0,20), new Date(2020,0,21), new Date(2020,0,22), new Date(2020,1,21)]
  
  dateFilter = (date: Date) => {
    for(var reserva of this.reservas){
      if(reserva.getTime() === date.getTime()){
        return false;
      }
    }
    return true;
  }

}
