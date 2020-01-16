import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import { HABITACIONES } from '@/_mockups/mock-habitaciones';
import { Habitacion } from '@/_models';
import { HabitacionService } from '@/_services/habitacion.service';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';


function precioMaximo(habitaciones: Habitacion[]): number{
  var max = 0;
  for(let habitacion of habitaciones){
    if(habitacion.precio > max){
      max = habitacion.precio;
    }
  }
  return max;
}

function ObtenerVistas(habitaciones: Habitacion[]){
  var aux: string[] = [];
  for(let habitacion of habitaciones){
    if(!aux.includes(habitacion.vistas)){
      aux.push(habitacion.vistas);
    }
  }
  var vistas: Vista[] = [];
  vistas.push({value: '', viewValue: 'Todas'})
  for(let vista of aux){
    vistas.push({value: vista, viewValue: vista});
  }
  return vistas;
}

interface Vista {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
  providers: [HabitacionService, DecimalPipe]
})
export class HabitacionesComponent implements OnInit {
  habitaciones: Habitacion[] = HABITACIONES;
  habitaciones$: Observable<Habitacion[]>;
  total$: Observable<number>;
  vistas: Vista[];
  currentRate;
  

  model: NgbDateStruct;

  ngOnInit() {
    this.vistas = ObtenerVistas(this.habitaciones);
  }
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: HabitacionService, private calendar: NgbCalendar) {
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

  minValue: number = 0;
  maxValue: number = precioMaximo(this.habitaciones);
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


  

}
