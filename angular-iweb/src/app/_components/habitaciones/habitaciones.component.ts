import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import { HABITACIONES } from '@/_mockups/mock-habitaciones';
import { Habitacion } from '@/_models';
import { HabitacionService } from '@/_services/habitacion.service';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
  providers: [HabitacionService, DecimalPipe]
})
export class HabitacionesComponent implements OnInit {

  minValue: number = 0;
  maxValue: number = 500;
  options: Options = {
    floor: this.minValue,
    ceil: this.maxValue,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> ' + value + '€';
        case LabelType.High:
          return '<b>Max price:</b> ' + value + '€';
        default:
          return value + '€';
      }
    }
  };



  habitaciones$: Observable<Habitacion[]>;
  total$: Observable<number>;
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: HabitacionService) {
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

  ngOnInit() {
  }

}
