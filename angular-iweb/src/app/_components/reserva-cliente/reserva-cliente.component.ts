import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch, MustSelector } from '@/_helpers/must-match.validator';
import { AlertService } from '@/_services';
import { ReservaClienteService } from '@/_services/reserva-cliente.service';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';
import { Observable } from 'rxjs';
import { HABITACIONES, SALAS } from '@/_mockups';
import { Regimen } from '@/_models';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';


@Component({
  selector: 'app-reserva-cliente',
  templateUrl: './reserva-cliente.component.html',
  styleUrls: ['./reserva-cliente.component.css'],
  providers: [ReservaClienteService]
})
export class ReservaClienteComponent implements OnInit {
  reservaForm: FormGroup;
  pago: FormGroup;
  seleccionForm: FormGroup;
  resumen: FormGroup;
  minDate: Date;
  submitted: boolean;
  lista$: Observable<any[]>;
  regimenes: Regimen[];
  total$: Observable<number>;
  seleccion: string;
  temporada: number;
  precioFinal: number;
  regimen: Regimen;
  isLinear = true;

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    public service: ReservaClienteService) {
    this.lista$ = service.disponible$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    this.seleccion = 'Habitación o sala'
    this.precioFinal = 0;
    this.temporada = 0.6;
    this.regimenes = [{codigo: -1, regimen: 'Selecciona un régimen', porcentaje: 1, es_sala : false}];
    this.regimen = {codigo: -1, regimen: 'Selecciona un régimen', porcentaje: 1, es_sala : false};
    this.alertService.clear();
    this.submitted = false;
    this.minDate = new Date();
    this.reservaForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    }, {
      validators: MustMatch('fechaInicio', 'fechaFinal')
    })
    this.seleccionForm = this.formBuilder.group({
      regimen: [this.regimen, Validators.required],
      seleccion: [this.seleccion]
    })
    this.pago = this.formBuilder.group({
      numeroTarjeta: ['', [Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(16)]],
      caducidad: ['', [Validators.required,
      Validators.pattern("[0-9][0-9]/[0-9][0-9]"),
      Validators.minLength(5)]],
      cvs: ['', [Validators.required,
      Validators.pattern("[0-9][0-9][0-9]"),
      Validators.minLength(3)]],
    })
    this.resumen = this.formBuilder.group({});
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  fechaReservaString(control: string){
    var dia = this.reservaForm.controls[control].value.getDate();
      var mes = this.reservaForm.controls[control].value.getMonth()+1;
      var anyo = this.reservaForm.controls[control].value.getFullYear();
      return anyo + '-' + mes + '-' + dia;
  }

  escogerTablaReservas(){
    if(this.reservaForm.get('tipo').value === 'habitacion'){
      this.service.getHabitaciones(this.fechaReservaString('fechaInicio'), this.fechaReservaString('fechaFinal'));
      this.service.getRegimenes().subscribe(data => {
        this.regimenes = [];
        for(var regimen of data){
          if(regimen.es_sala === 0){
            this.regimenes.push(regimen);
          }
        }
      })
    }else{
      this.service.getSalas();
      this.service.getRegimenes().subscribe(data => {
        this.regimenes = [];
        for(var regimen of data){
          if(regimen.es_sala === 1){
            this.regimenes.push(regimen);
          }
        }
      })
    }
  }

  cambiarSeleccion(id: number) {
    if (this.reservaForm.get('tipo').value === 'habitacion') {
      this.seleccion = 'Habitación ' + id;
      this.precioFinal = (HABITACIONES[id].precio * this.temporada) + HABITACIONES[id].precio;
    } else {
      this.seleccion = 'Sala ' + id;
      this.precioFinal = (SALAS[id].precio * this.temporada) + SALAS[id].precio;
    }
  }

  get sf() { return this.seleccionForm.controls; }
  get rf() { return this.reservaForm.controls; }
  get pf() { return this.pago.controls; }


  public errorHandlingReserva = (control: string, error: string) => {
    return this.reservaForm.controls[control].hasError(error);
  }

  public errorHandlingSeleccion = (control: string, error: string) => {
    return this.seleccionForm.controls[control].hasError(error);
  }

  public errorHandlingPago = (control: string, error: string) => {
    return this.pago.controls[control].hasError(error);
  }

  onSubmitReserva() { // Cuando haces botón de realizar reserva
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.reservaForm.invalid) {
      return;
    }
    this.submitted = false;
  }

  onSubmitSeleccion() { // Cuando haces botón de realizar reserva
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.seleccionForm.invalid) {
      return;
    }
    this.submitted = false;
  }

  onSubmitPago() { // Cuando haces botón de realizar reserva
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.pago.invalid) {
      return;
    }
    this.submitted = false;

    // Aqui sigue con el servicio
  }

  onSubmitResumen() { // Cuando haces botón de realizar reserva
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.pago.invalid || this.seleccionForm.invalid || this.reservaForm.invalid) {
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