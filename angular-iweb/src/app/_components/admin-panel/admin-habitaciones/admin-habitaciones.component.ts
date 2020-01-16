import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { User , Habitacion } from '@/_models';
import { USUARIO , HABITACIONES} from '@/_mockups';

import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { AdminHabitacionesService} from '@/_services';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';


@Component({
  selector: 'app-admin-habitaciones',
  templateUrl: './admin-habitaciones.component.html',
  styleUrls: ['./admin-habitaciones.component.css'],
  providers: [AdminHabitacionesService, DecimalPipe]
})
export class AdminHabitacionesComponent implements OnInit {

  habitaciones$: Observable<Habitacion[]>;
  total$: Observable<number>;
  edit = false;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: AdminHabitacionesService) {
    this.habitaciones$ = service.habitaciones$;
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

  delete(id : number){
    this.service.deleteHabitacion(id).subscribe(() => {
      this.service.getHabitaciones();
    });
  }

  ngOnInit() {
  }
}