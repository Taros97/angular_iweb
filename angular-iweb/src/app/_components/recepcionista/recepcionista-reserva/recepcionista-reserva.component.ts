import { Component, OnInit } from '@angular/core';
import { HabitacionService, SalaService, AlertService } from '@/_services'
import { DecimalPipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MustMatch } from '@/_helpers/must-match.validator';

export interface lista {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-recepcionista-reserva',
  templateUrl: './recepcionista-reserva.component.html',
  styleUrls: ['./recepcionista-reserva.component.css'],
  providers: [HabitacionService, SalaService, DecimalPipe]
})
export class RecepcionistaReservaComponent implements OnInit {
  disabledHabitacion = false;
  disabledSala = false;
  tipo: String = '(Selecciona habitación o sala)'
  lista: lista[];
  regimenes: lista[];
  reservaRecepcionista: FormGroup; 
  submitted = false;
  minDate : Date;

  constructor(private serviceHabitacion: HabitacionService,
              private serviceSala: SalaService,
              private formBuilder: FormBuilder,
              private alertService: AlertService) {
  }

  get f() { return this.reservaRecepcionista.controls; }

  ngOnInit() {
    
    this.alertService.clear();
    this.minDate = new Date();
    this.reservaRecepcionista = this.formBuilder.group({
      habitacion: [''],
      sala: [''],
      reserva: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bloquear: [''],
      regimen: ['', Validators.required]
    }, {
      validator: MustMatch('fechaInicio', 'fechaFinal')
  });
    this.lista = [
      { value: 0, viewValue: 'Selecciona tipo de reserva' },
    ];
  }

  public errorHandling = (control: string, error: string) => {
    return this.reservaRecepcionista.controls[control].hasError(error);
  }

  onSubmit(){ // Cuando haces botón de realizar reserva
    this.submitted = true;
            // reset alerts on submit
            this.alertService.clear();

            // stop here if form is invalid
            if (this.reservaRecepcionista.invalid) {
                return;
            }

            // Aqui sigue con el servicio
  }

  habitaciones() {
    if(!this.disabledHabitacion){
      this.lista = [];
      this.regimenes = [];
      this.tipo = 'habitaciones';
      // Habría que hacer la llamada al servicio y del servicio a la API...
      /*
      for(var habitacion of this.serviceHabitacion.habitaciones){
        this.lista.push({value: habitacion.codigo, viewValue: habitacion.codigo.toString()});
      }*/
      for(var regimen of this.serviceHabitacion.regimenes){
        this.regimenes.push({value: regimen.value, viewValue: regimen.viewValue});
      }
    }
  }

  salas() {
    if(!this.disabledSala){
      this.lista = [];
      this.regimenes = [];
      this.tipo = 'salas';
      // Habría que hacer la llamada al servicio y del servicio a la API...
      /*
      for(var sala of this.serviceSala.salas){
        this.lista.push({value: sala.codigo, viewValue: sala.codigo.toString()});
      }
      */
      for(var regimen of this.serviceSala.regimenes){
        this.regimenes.push({value: regimen.value, viewValue: regimen.viewValue});
      }
    }
  }

}
