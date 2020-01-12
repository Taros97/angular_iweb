import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { Sala } from '@/_models';
import { SortDirection } from '@/_directives/sortable.directive';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { SALAS } from '@/_mockups/mock-salas';


interface SearchResult {
  salas: Sala[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  filterMesas;
  filterAsientos;
  filterPrecio: number;
  filterPuntuacion: number;
  filterProyector: boolean;
  filterMicrofono: boolean;
  filterPizarra: boolean;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(salas: Sala[], column: string, direction: string): Sala[] {
  if (direction === '') {
    return salas;
  } else {
    return [...salas].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(sala: Sala, term: string, pipe: PipeTransform) {
  return sala.descripcion.toLowerCase().includes(term.toLowerCase());
}

function matchesMesas(sala: Sala, mesas: number, pipe: PipeTransform){
  return sala.mesas >= mesas;
}

function matchesAsientos(sala: Sala, asientos: number, pipe: PipeTransform){
  return sala.asientos >= asientos;
}

function matchesPuntuacion(sala: Sala, puntuacion: number, pipe: PipeTransform){
  if(puntuacion){
    return puntuacion <= sala.puntuacion;
  }
  return true;
}

function matchesPrecio(sala: Sala, precio: number, pipe: PipeTransform){
  return sala.precio >= precio[0] && sala.precio <= precio[1];
}

function matchesMicrofono(sala: Sala, microfono: boolean, pipe: PipeTransform){
  if(microfono){
    return sala.microfono == microfono;
  }
  return true;
}

function matchesPizarra(sala: Sala, pizarra: boolean, pipe: PipeTransform){
  if(pizarra){
    return sala.pizarra == pizarra;
  }
  return true;
}

function matchesProyector(sala: Sala, proyector: boolean, pipe: PipeTransform){
  if(proyector){
    return sala.proyector == proyector;
  }
  return true;
}

function getSala(id: number): Sala {
  var i = 0, terminado = false;
  while(!terminado){
    if(this.salas$[i]){
      terminado = true;
    }else if(!this.salas$[i] && this.salas$[i].id == id){
      return this.salas$[i];
    }else{
      i++;
    }
    return null;
  }
}

@Injectable({providedIn: 'root'})
export class SalaService { 
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _salas$ = new BehaviorSubject<Sala[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    filterMesas: '',
    filterAsientos: '',
    filterPrecio: 0,
    filterPuntuacion: 0,
    filterMicrofono: false,
    filterPizarra: false,
    filterProyector: false
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._salas$.next(result.salas);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  getSala(id: number){
    for(let sala of this.salas){
      if(sala.codigo == id){
        return sala;
      }
    }
  }

  get salas() { return SALAS; }
  get salas$() { return this._salas$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get filterPrecio() { return this._state.filterPrecio; }
  get filterPuntuacion() { return this._state.filterPuntuacion; }
  get filterMesas() { return this._state.filterMesas; }
  get filterAsientos() { return this._state.filterAsientos; }
  get filterMicrofono() { return this._state.filterMicrofono; }
  get filterProyector() { return this._state.filterProyector; }
  get filterPizarra() { return this._state.filterPizarra; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set filterPrecio(filterPrecio: number) { this._set({filterPrecio}); }
  set filterMesas(filterMesas: number) { this._set({filterMesas}); }
  set filterPuntuacion(filterPuntuacion: number) { this._set({filterPuntuacion}); }
  set filterAsientos(filterAsientos: number) { this._set({filterAsientos}); }
  set filterMicrofono(filterMicrofono: boolean) { this._set({filterMicrofono}); }
  set filterProyector(filterProyector: boolean) { this._set({filterProyector}); }
  set filterPizarra(filterPizarra: boolean) { this._set({filterPizarra}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    
    const {sortColumn, sortDirection, pageSize, page, searchTerm, filterMesas, filterAsientos, 
      filterPuntuacion, filterPrecio, filterProyector, filterMicrofono, filterPizarra} = this._state;

    // 1. sort
    let salas = sort(SALAS, sortColumn, sortDirection);
    
    // 2. filter
    salas = salas.filter(sala => matches(sala, searchTerm, this.pipe));
    salas = salas.filter(sala => matchesMesas(sala, filterMesas, this.pipe));
    salas = salas.filter(sala => matchesAsientos(sala, filterAsientos, this.pipe));
    salas = salas.filter(sala => matchesPuntuacion(sala, filterPuntuacion, this.pipe));
    salas = salas.filter(sala => matchesPrecio(sala, filterPrecio, this.pipe));
    salas = salas.filter(sala => matchesProyector(sala, filterProyector, this.pipe));
    salas = salas.filter(sala => matchesMicrofono(sala, filterMicrofono, this.pipe));
    salas = salas.filter(sala => matchesPizarra(sala, filterPizarra, this.pipe));
    const total = salas.length;

    // 3. paginate
    salas = salas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({salas, total});
  }
}
