import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { SortDirection } from '@/_directives/sortable.directive';

import { Reserva } from '@/_models';
import { RESERVAS } from '@/_mockups';

interface SearchResult {
  reservas: Reserva[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(reservas: Reserva[], column: string, direction: string): Reserva[] {
  if (direction === '') {
    return reservas;
  } else {
    return [...reservas].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}


function matches(reserva: Reserva, term: string, pipe: PipeTransform) {
  return reserva.descripcion.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(reserva.codigo).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _reservas$ = new BehaviorSubject<Reserva[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
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

    this._search$.next();
  }
  get reservas$() { return this._reservas$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }
  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  get searchTerm() { return this._state.searchTerm; }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }


  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let reservas = sort(RESERVAS, sortColumn, sortDirection);

    // 2. filter
    reservas = reservas.filter(country => matches(country, searchTerm, this.pipe));
    const total = reservas.length;

    // 3. paginate
    reservas = reservas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({reservas, total});
  }
}
