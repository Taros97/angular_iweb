import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch, MustSelector } from '@/_helpers/must-match.validator';
import { AlertService } from '@/_services';
import { ReservaClienteService } from '@/_services/reserva-cliente.service';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reserva-cliente',
  templateUrl: './reserva-cliente.component.html',
  styleUrls: ['./reserva-cliente.component.css'],
  providers: [ReservaClienteService]
})
export class ReservaClienteComponent implements OnInit {
  minDate: Date;
  reservaCliente: FormGroup;
  submitted: boolean;
  lista$: Observable<any[]>;
  total$: Observable<number>;
  seleccion: string;

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    public service: ReservaClienteService) {
      this.lista$ = service.disponible$;
      this.total$ = service.total$;
  }

  ngOnInit() {
    this.seleccion = 'Habitación o sala'
    this.alertService.clear();
    this.submitted = false;
    this.minDate = new Date();
    this.reservaCliente = this.formBuilder.group({
      tipo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      seleccion: [this.seleccion],
      numeroTarjeta: ['', [Validators.required,
                            Validators.pattern("^[0-9]*$"),
                            Validators.minLength(16),]]
      /*sala: [''],
      reserva: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bloquear: [''],
      regimen: ['', Validators.required]*/
    }, {
      validators: [MustMatch('fechaInicio', 'fechaFinal'), MustSelector('seleccion')]
    });
    //this.reservaCliente.get('seleccion').disable();
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

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

  cambiarSeleccion(id: number){
    if(this.reservaCliente.get('tipo').value === 'habitacion'){
      this.seleccion = 'Habitación ' + id;
    }else{
      this.seleccion = 'Sala ' + id;
    }
  }

  get f() { return this.reservaCliente.controls; }

  public errorHandling = (control: string, error: string) => {
    return this.reservaCliente.controls[control].hasError(error);
  }

  onSubmit() { // Cuando haces botón de realizar reserva
    /**this.reservaCliente.get('seleccion').enable();
    this.reservaCliente.get('seleccion').value = this.seleccion;*/
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    console.log(this.reservaCliente)
    // stop here if form is invalid
    if (this.reservaCliente.invalid) {
      //this.reservaCliente.get('seleccion').disable();
      return;
    }
    
    // Aqui sigue con el servicio
  }





  /**reservas = [new Date(2020,0,20), new Date(2020,0,21), new Date(2020,0,22), new Date(2020,1,21)]
  
  dateFilter = (date: Date) => {
    for(var reserva of this.reservas){
      if(reserva.getTime() === date.getTime()){
        return false;
      }
    }
    return true;
  }*/

}
