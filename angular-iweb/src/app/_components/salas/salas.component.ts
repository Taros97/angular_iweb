import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import { SALAS } from '@/_mockups';
import { Sala } from '@/_models';
import { SalaService } from '@/_services';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';
import { DecimalPipe } from '@angular/common';


function precioMaximo(salas: Sala[]): number{
  var max = 0;
  for(let sala of salas){
    if(sala.precio > max){
      max = sala.precio;
    }
  }
  return max;
}

@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css'],
  providers: [SalaService, DecimalPipe]
})
export class SalasComponent implements OnInit {
  salas: Sala[] = SALAS;
  salas$: Observable<Sala[]>;
  total$: Observable<number>;
  currentRate;

  ngOnInit() {}
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: SalaService) {
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

  minValue: number = 0;
  maxValue: number = precioMaximo(this.salas);
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
