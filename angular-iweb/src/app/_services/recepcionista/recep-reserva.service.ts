import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, catchError } from 'rxjs/operators';
import { SortDirection } from '@/_directives/sortable.directive';

import { ReservaFinal } from '@/_models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

interface SearchResult {
  reservas: ReservaFinal[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  filterDate: Date;
  filterCodigo: string;
  filterEmail: string;
}


function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(reservas: ReservaFinal[], column: string, direction: string): ReservaFinal[] {
  if (direction === '') {
    return reservas;
  } else {
    return [...reservas].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}


function matches(reserva: ReservaFinal, term: string, pipe: PipeTransform) {
  return pipe.transform(reserva.codigo).includes(term);
}

function matchesCodigo(reserva: ReservaFinal, term: string, pipe: PipeTransform) {
  if (term !== 'Ninguno') {
    if (term !== '') {
      if (term === 'habitacion') {
        if (reserva.habitacion)
          return true;
        return false;
      } else if (term === 'sala') {
        if (reserva.sala)
          return true;
        return false;
      } else {
        if (reserva.tipo_reserva === 3)
          return true;
        return false;
      }
    }
  }
  return true;
}

function matchesEmail(reserva: ReservaFinal, term: string, pipe: PipeTransform) {
  return reserva.usuario.toLowerCase().includes(term.toLowerCase());
}

function matchesDate(reserva: ReservaFinal, date: Date, pipe: PipeTransform) {
  var cadenaSeparar = reserva.fecha_inicio.split('-')
  var fechaComparar = new Date(parseInt(cadenaSeparar[0]), parseInt(cadenaSeparar[1]) - 1, parseInt(cadenaSeparar[2]));
  if (date) {
    if (fechaComparar.getFullYear() === date.getFullYear()) {
      if (fechaComparar.getMonth() === date.getMonth()) {
        if (fechaComparar.getDay() === date.getDay()) {
          return true;
        }
      }
    }
    return false;
  }
  return true;
}

@Injectable({
  providedIn: 'root'
})
export class RecepReservaService {
  // API CUANDO ESTE RELLENAR URL
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private apiURL = '';
  private httpReserva: ReservaFinal[];


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _reservas$ = new BehaviorSubject<ReservaFinal[]>([]);
  private _total$ = new BehaviorSubject<number>(0);



  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    filterDate: null,
    filterCodigo: '',
    filterEmail: ''
  };

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    // API CUANDO ESTE
    this.http.get<ReservaFinal[]>(environment.apiUrl+'reservas').subscribe(data => {
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
      })
      this._set({searchTerm: ''})
    });

      this._search$.next();
    }

    public getReservas(){
      // API CUANDO ESTE
      this.http.get<ReservaFinal[]>(environment.apiUrl+'reservas').subscribe(data =>{
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
        })
        this._set({searchTerm:''});
      });
    }

  get reservas$() { return this._reservas$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get filterDate() { return this._state.filterDate; }
  get filterCodigo() { return this._state.filterCodigo; }
  get filterEmail() { return this._state.filterEmail; }

  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  set page(page: number) { this._set({ page }); }
  set filterDate(filterDate: Date) { this._set({ filterDate }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set filterCodigo(filterCodigo: string) { this._set({ filterCodigo }); }
  set filterEmail(filterEmail: string) { this._set({ filterEmail }); }

  private _set(patch: Partial<State>) {
      Object.assign(this._state, patch);
      this._search$.next();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  public deleteReserva(codigo: number): Observable<ReservaFinal> {
    const url = `${environment.apiUrl}reservas/${codigo}`;

    return this.http.delete<ReservaFinal>(url, this.httpOptions).pipe(
      catchError(this.handleError<ReservaFinal>('deleteReserva'))
    );
  }

  private _search(): Observable < SearchResult > {
      const {
        sortColumn, sortDirection, pageSize, page, searchTerm, filterDate
        , filterEmail, filterCodigo
      } = this._state;
      // 1. sort
      
      let reservas = sort(this.httpReserva, sortColumn, sortDirection);
      // 2. filter
      reservas = reservas.filter(reserva => matches(reserva, searchTerm, this.pipe));
      reservas = reservas.filter(reserva => matchesDate(reserva, filterDate, this.pipe));
      reservas = reservas.filter(reserva => matchesCodigo(reserva, filterCodigo, this.pipe));
      reservas = reservas.filter(reserva => matchesEmail(reserva, filterEmail, this.pipe));

      const total = reservas.length;
      // 3. paginate
      reservas = reservas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({ reservas, total });
    }
}
