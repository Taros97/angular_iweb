import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap, catchError} from 'rxjs/operators';
import { SortDirection } from '@/_directives/sortable.directive';

import { Sala } from '@/_models';
import { SALAS } from '@/_mockups';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { spinnerButtonPositionDictionary } from 'ng-metro4';
import { environment } from 'environments/environment';

interface SearchResult {
  salas: Sala[];
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
  return sala.descripcion.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(sala.codigo).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class AdminSalasService {

  // API CUANDO ESTE RELLENAR URL
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private apiURL = '';
  private httpSala: Sala[];


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _salas$ = new BehaviorSubject<Sala[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    filterDate: null
  };

  constructor(private pipe: DecimalPipe, private http: HttpClient) {

    // API CUANDO ESTE
    
    this.http.get<Sala[]>(environment.apiUrl + 'salas').subscribe(data =>{
      this.httpSala = data;
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
    this._set({searchTerm: ''})
    });

    this._search$.next();
  }

  getSala(id: number){
    return this.http.get<Sala>(environment.apiUrl + 'salas/' + id);
  }

  updateSala(id: number, data: Sala){
    return this.http.put<Sala>(environment.apiUrl + 'salas/' + id, data, this.httpOptions);
  }

  public getSalas(){
    // API CUANDO ESTE
    this.http.get<Sala[]>(environment.apiUrl+'salas').subscribe(data =>{
      this.httpSala = data;
      this._search$.pipe(
        switchMap(() => this._search()),
      ).subscribe(result => {
        this._salas$.next(result.salas);
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

  public deleteSala(codigo: number): Observable<Sala> {
    const url = `${environment.apiUrl}salas/${codigo}`;

    return this.http.delete<Sala>(url, this.httpOptions).pipe(
      catchError(this.handleError<Sala>('deleteHabitacion'))
    );
  }

  get salas$() { return this._salas$.asObservable(); }
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
  
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 1. sort

    // API CUANDO ESTE
    // let salas = sort(httpSala, sortColumn, sortDirection);
    // Sustituir la siguiente por esta
    let salas = sort(this.httpSala, sortColumn, sortDirection);
    // 2. filter
    salas = salas.filter(sala => matches(sala, searchTerm, this.pipe));
    const total = salas.length;
    // 3. paginate
    salas = salas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({salas, total});
  }
}
