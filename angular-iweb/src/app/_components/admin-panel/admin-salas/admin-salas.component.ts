import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { User , Sala } from '@/_models';
import { USUARIO , SALAS} from '@/_mockups';

import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { AdminSalasService } from '@/_services';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';


@Component({
  selector: 'app-admin-salas',
  templateUrl: './admin-salas.component.html',
  styleUrls: ['./admin-salas.component.css'],
  providers: [AdminSalasService, DecimalPipe]
})
export class AdminSalasComponent implements OnInit {

  salas$: Observable<Sala[]>;
  total$: Observable<number>;

  user = USUARIO;
  //salas = SALAS;
  edit = false;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: AdminSalasService) {
    this.salas$ = service.salas$;
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