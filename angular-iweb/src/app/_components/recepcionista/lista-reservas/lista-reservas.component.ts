import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Reserva } from '@/_models';

import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { RecepReservaService } from '@/_services';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';

@Component({
  selector: 'app-lista-reservas',
  templateUrl: './lista-reservas.component.html',
  styleUrls: ['./lista-reservas.component.css'],
  providers: [RecepReservaService, DecimalPipe]
})
export class ListaReservasComponent implements OnInit {

  reservas$: Observable<Reserva[]>;
  total$: Observable<number>;
  selected = 'Sala';
  //reservas = RESERVAS;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: RecepReservaService) {
    this.reservas$ = service.reservas$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  ngOnInit() {
  }

  borrarReserva(id){
    console.log(id)
  }

}
