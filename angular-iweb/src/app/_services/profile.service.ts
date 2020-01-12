import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { SortDirection } from '@/_directives/sortable.directive';

import { Reserva } from '@/_models';
import { RESERVAS } from '@/_mockups';
import { HttpClient } from '@angular/common/http';
import { spinnerButtonPositionDictionary } from 'ng-metro4';

interface SearchResult {
  reservas: Reserva[];
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

function matchesDate(reserva: Reserva, date: fecha, pipe: PipeTransform) {
  if(date == null)
    return true;

  /*
  console.log("Fecha")
  console.log(date.year)
  console.log("Inicio")
  console.log(reserva.fechaInicio.getFullYear())
  console.log("Fin")
  console.log(reserva.fechaFin.getFullYear())

  console.log(reserva.fechaInicio.getFullYear() >= date.year || reserva.fechaFin.getFullYear() <= date.year)
*/

  const a = new Date (date.year, date.month , date.day );

  var Difference_In_Time_early = a.getTime() - reserva.fechaInicio.getTime();
  var Difference_In_Time_late =  reserva.fechaFin.getTime() - a.getTime() ; 
  // asi deberia de funcionar xd
  var Difference_In_Days_early = Difference_In_Time_early / (1000 * 3600 * 24); 
  var Difference_In_Days_late = Difference_In_Time_late / (1000 * 3600 * 24); 
  console.log(Difference_In_Days_early)
  console.log(Difference_In_Days_late)
  return Difference_In_Days_early >= 0 &&  Difference_In_Days_late >= 0; 



  // Necesitamos saber si esta entre fecha inicio y fecha final
  // Date es lo que busca?  si tiene dia, mes y año va

  /*
  if(date.year >= reserva.fechaInicio.getFullYear() && date.year <= reserva.fechaFin.getFullYear()) // yaya pero primero el año, luego el mes, voy a ver el mes
  if((date.year - reserva.fechaInicio.getFullYear()) == -1 && (date.year - reserva.fechaInicio.getFullYear()) >= 0){ // sabemos que hay un salto de año

  }else{ // No hay salto de año

  }

  if((date.month - reserva.fechaInicio.getMonth()) == -1 && (date.month - reserva.fechaInicio.getMonth()) >= 0){ // sabemos que hay un salto de mes
    
  }else{ // No hay salto de mes

  }
  // entiendes???????????????????????????????????? Estaba mirando cosas en el movil a ver si encontraba alguna libreria que lo hiciese xd oka dejame pensar
   //date.month >= reserva.fechaInicio.getMonth() && date.month <= reserva.fechaFin.getMonth())
  if(date.day >=) 
*/

  /*

      var Difference_In_Time = date2.getTime() - date1.getTime(); 

      // To calculate the no. of days between two dates 
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

      //To display the final no. of days (result) 
      document.write("Total number of days between dates  <br>"
      + date1 + "<br> and <br>" 
      + date2 + " is: <br> " 
      + Difference_In_Days); 


      Inicio                    date                    Fin
      30-12-1999            5-02-2000             25-03-2000

      En este caso por ejemplo
      El año esta
      el mes tambien
      Si me refiero a que uno no depende del otro peXDDDDDDDDro si xdescribe espera dios jajajjaaj
      Entiendes ahora el problema que me estaba haciendo la cabeza? XDD
      es que tienes que saber si hay salgo de año o no, igual para el mes
      getFullYear esto es numero?? si

      Gracias sin autocompletar xDDDDDDDDD
      Pero es eso osea el año puede ser menor
      PEro el problema viene que el mes depende del año porque aunque sea menor el mes si el año difiere
      mira, veo hacer una cosa, if's diferentes pero primero compruebas año, luego mes y luego dia, el dia va a ser chungo que si que tiene que ir con el mes
      El mes tambien es problema, sisisisi, es ez, mira

      A ver, probemos
Esto era lo que yo estaba viendo en el mobil
wtf xddd

      
  if(reserva.fechaInicio.getFullYear() >= date.year || reserva.fechaFin.getFullYear() <= date.year)
    return false;
  if(reserva.fechaInicio.getMonth() >= date.month || reserva.fechaFin.getMonth() <= date.month)
    return false;
  if(reserva.fechaInicio.getDay() >= date.day || reserva.fechaFin.getDay() <= date.day)
    return false;
  return true;*/

}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // API CUANDO ESTE RELLENAR URL
  private apiURL = '';
  private httpReserva: Reserva[];


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _reservas$ = new BehaviorSubject<Reserva[]>([]);
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
  get filterDate() { return this._state.filterDate; } 
  set filterDate(filterDate: fecha) { this._set({filterDate}); } 
  
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, filterDate} = this._state;
    // 1. sort

    // API CUANDO ESTE
    // let reservas = sort(httpReserva, sortColumn, sortDirection);
    // Sustituir la siguiente por esta
    let reservas = sort(RESERVAS, sortColumn, sortDirection);
    // 2. filter
    reservas = reservas.filter(reserva => matches(reserva, searchTerm, this.pipe));
    reservas = reservas.filter(reserva => matchesDate(reserva, filterDate, this.pipe));

    const total = reservas.length;
    // 3. paginate
    reservas = reservas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({reservas, total});
  }
}
