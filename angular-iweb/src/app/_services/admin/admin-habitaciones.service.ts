import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap,catchError} from 'rxjs/operators';
import { SortDirection } from '@/_directives/sortable.directive';

import { Habitacion } from '@/_models';
import { HABITACIONES } from '@/_mockups';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'environments/environment';

interface SearchResult {
  habitaciones: Habitacion[];
  total: number;
}

interface fecha {
  day : number;
  month: number;
  year: number;
}


interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  filterDate: fecha;
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
    || pipe.transform(habitacion.codigo).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class AdminHabitacionesService {

  // API CUANDO ESTE RELLENAR URL
  private apiURL = '';
  private httpHabitacion: Habitacion[];


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _habitaciones$ = new BehaviorSubject<Habitacion[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public httpHabitaciones: Habitacion[];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' , Authorization: `Bearer ${localStorage.token}`})
  };

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    filterDate: null
  };

  constructor(private pipe: DecimalPipe, private http: HttpClient) {

    this.getHabitaciones();

/*
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
*/
    this._search$.next();
  }

  getHabitacion(id: number) : Observable<Habitacion>{

    return this.http.get<Habitacion>(environment.apiUrl+'/habitaciones/' + id)
    .pipe(
      catchError(this.handleError<Habitacion>('habitaciones', ))
    );
  }

  getHabitacionesVistas() : Observable<Habitacion[]>{
    return this.http.get<Habitacion[]>(environment.apiUrl+'habitaciones')
      .pipe(
        catchError(this.handleError<Habitacion[]>('getHabitacionesVistas',[]))
      );
  }

  public getHabitaciones(){
    // API CUANDO ESTE
    return this.http.get<Habitacion[]>(environment.apiUrl+'habitaciones').subscribe(data =>{
      this.httpHabitaciones = data;
      this._search$.pipe(
        switchMap(() => this._search()),
      ).subscribe(result => {
        this._habitaciones$.next(result.habitaciones);
        this._total$.next(result.total);
      });
      this._set({searchTerm:''});
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  deleteHabitacion(codigo: number): Observable<Habitacion> {
    const url = `${environment.apiUrl}habitaciones/${codigo}`;

    return this.http.delete<Habitacion>(url, this.httpOptions).pipe(
      catchError(this.handleError<Habitacion>('deleteHabitacion'))
    );
  }

  createHabitacion(h: Habitacion): Observable<Habitacion> {
    const url = `${environment.apiUrl}habitaciones`;

    return this.http.post<Habitacion>(url, h, this.httpOptions).pipe(
      catchError(this.handleError<Habitacion>('deleteHabitacion'))
    );
  }


  updateHabitacion(id: number, data: Habitacion){
    return this.http.put<Habitacion>(environment.apiUrl + 'habitaciones/' + id, data, this.httpOptions);
  }

  
  get habitaciones$() { return this._habitaciones$.asObservable(); }
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
  get filterDate() { return this._state.filterDate; } 
  set filterDate(filterDate: fecha) { this._set({filterDate}); } 
  
  public  _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 1. sort

    // API CUANDO ESTE
    // let habitaciones = sort(httpHabitacion, sortColumn, sortDirection);
    // Sustituir la siguiente por esta
    let habitaciones = sort(this.httpHabitaciones, sortColumn, sortDirection);
    // 2. filter
    habitaciones = habitaciones.filter(habitacion => matches(habitacion, searchTerm, this.pipe));
    const total = habitaciones.length;
    // 3. paginate
    habitaciones = habitaciones.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({habitaciones, total});
  }
}
