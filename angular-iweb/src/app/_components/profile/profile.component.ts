import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { User , Reserva } from '@/_models';
import { USUARIO , RESERVAS} from '@/_mockups';

import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { ProfileService } from '@/_services';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService, DecimalPipe]
})
export class ProfileComponent implements OnInit {

  countries$: Observable<Reserva[]>;
  total$: Observable<number>;

  user = USUARIO;
  //reservas = RESERVAS;
  edit = false;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: ProfileService) {
    this.countries$ = service.reservas$;
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
}

