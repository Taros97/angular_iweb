import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { SortDirection } from '@/_directives/sortable.directive';

import { Reserva, Habitacion, Sala } from '@/_models';
import { RESERVAS, HABITACIONES, SALAS } from '@/_mockups';
import { HttpClient } from '@angular/common/http';
import { spinnerButtonPositionDictionary } from 'ng-metro4';
import { environment } from 'environments/environment';

interface SearchResult {
  habitaciones?: Habitacion[];
  salas?: Sala[];
  total: number;
}


interface State {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: SortDirection;
  tipo: string;
}


function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sortHabitacion(habtiaciones: Habitacion[], column: string, direction: string): Habitacion[] {
  if (direction === '') {
    return habtiaciones;
  } else {
    return [...habtiaciones].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function sortSala(salas: Sala[], column: string, direction: string): Sala[] {
  if (direction === '') {
    return salas;
  } else {
    return [...salas].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}



@Injectable({
  providedIn: 'root'
})
export class ReservaClienteService {

  // API CUANDO ESTE RELLENAR URL
  private apiURL = '';
  private httpReserva: Reserva[];


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _disponible$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private habitaciones : Habitacion[];
  private salas : Sala[];

  

  private _state: State = {
    page: 1,
    pageSize: 4,
    sortColumn: '',
    sortDirection: '',
    tipo: ''
  };

  constructor(private pipe: DecimalPipe, private http: HttpClient) {

    // API CUANDO ESTE
    /*
    this.http.get<Reserva[]>(this.apiURL).subscribe(data =>{
      this.httpReserva = data;
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._reservas$.next(result.reservas);
        this._total$.next(result.total);
      });
    });
    */
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      if(result.habitaciones){
        this._disponible$.next(result.habitaciones);
        this._total$.next(result.total);
      }else if(result.salas){
        this._disponible$.next(result.salas);
        this._total$.next(result.total);
      }else{
        this._disponible$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  public getHabitaciones(){
    this.http.get<Habitacion[]>(environment.apiUrl + 'habitacionesReserva').subscribe(data =>{
      this.habitaciones = data;
      this._set({pageSize: 4});
    });
  }

  public getSalas(){
    this.http.get<Sala[]>(environment.apiUrl + 'salasReserva').subscribe(data =>{
      this.salas = data;
      this._set({pageSize: 4});
    });
  }


  get disponible$() { return this._disponible$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }
  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  get tipo() { return this._state.tipo; }
  set tipo(tipo: string) { this._set({tipo}); }
  
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }



  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, tipo} = this._state;
    if(tipo === 'habitacion' && this.habitaciones){
      let habitaciones = sortHabitacion(this.habitaciones, sortColumn, sortDirection);
      const total = habitaciones.length;
      habitaciones = habitaciones.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({habitaciones, total});
    }else if(tipo === 'sala' && this.salas){
      let salas = sortSala(this.salas, sortColumn, sortDirection);
      const total = salas.length;
      salas = salas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({salas, total});
    }else{
      let lista = sortHabitacion([], sortColumn, sortDirection);
      const total = lista.length;
      return of({lista, total})
    }
  }
}
