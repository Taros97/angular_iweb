import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { Habitacion } from '@/_models';
import { SortDirection } from '@/_directives/sortable.directive';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { HABITACIONES } from '@/_mockups/mock-habitaciones';


interface SearchResult {
  habitaciones: Habitacion[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  filterPlazas: number;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(habitaciones: Habitacion[], column: string, direction: string): Habitacion[] {
  if (direction === '') {
    return habitaciones;
  } else {
    return [...habitaciones].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(habitacion: Habitacion, term: string, pipe: PipeTransform) {
  return habitacion.descripcion.toLowerCase().includes(term.toLowerCase())
    || habitacion.categoria.toLowerCase().includes(term.toLowerCase());
}

function matchesPlazas(habitacion: Habitacion, plazas: number, pipe: PipeTransform){
  return habitacion.plazas >= plazas;
}

@Injectable({providedIn: 'root'})
export class HabitacionService { 
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _habitaciones$ = new BehaviorSubject<Habitacion[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    filterPlazas: 0
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._habitaciones$.next(result.habitaciones);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get habitaciones$() { return this._habitaciones$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get filterPlazas() { return this._state.filterPlazas; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set filterPlazas(filterPlazas: number) { this._set({filterPlazas}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    //console.log(this)
    const {sortColumn, sortDirection, pageSize, page, searchTerm, filterPlazas} = this._state;
    // 1. sort
    let habitaciones = sort(HABITACIONES, sortColumn, sortDirection);
    

    // 2. filter
    habitaciones = habitaciones.filter(habitacion => matches(habitacion, searchTerm, this.pipe));
    habitaciones = habitaciones.filter(habitacion => matchesPlazas(habitacion, filterPlazas, this.pipe));
    
    const total = habitaciones.length;

    // 3. paginate
    habitaciones = habitaciones.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({habitaciones, total});
  }
}
