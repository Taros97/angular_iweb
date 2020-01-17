import { Component, OnInit } from '@angular/core';
import { HabitacionService, SalaService, AlertService, RecepReservaService } from '@/_services'
import { DecimalPipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MustMatch } from '@/_helpers/must-match.validator';
import { Router } from '@angular/router';
import { Role } from '@/_models';

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
              private alertService: AlertService,
              private service: RecepReservaService,
              private router: Router) {
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

  fechaReservaString(control: string) {
    var dia = this.reservaRecepcionista.controls[control].value.getDate();
    var mes = this.reservaRecepcionista.controls[control].value.getMonth() + 1;
    var anyo = this.reservaRecepcionista.controls[control].value.getFullYear();
    return anyo + '-' + mes + '-' + dia;
  }

  onSubmit(){ // Cuando haces botón de realizar reserva
    this.submitted = true;
            // reset alerts on submit
            this.alertService.clear();

            // stop here if form is invalid
            if (this.reservaRecepcionista.invalid) {
                return;
            }
            var json;
            if (!this.disabledHabitacion) {
              json = {
                "fecha_inicio": this.fechaReservaString('fechaInicio'),
                "fecha_fin": this.fechaReservaString('fechaFinal'),
                "descripcion": "Reserva realizada con éxito",
                "usuario": JSON.parse(localStorage.getItem('currentUser')).email,
                "habitacion": this.reservaRecepcionista.controls['habitacion'].value,
                "sala_conferencia": null,
                "regimen": parseInt(this.reservaRecepcionista.get('regimen').value),
                "tipo_reserva": 2
              }
            } else {
              json = {
                "fecha_inicio": this.fechaReservaString('fechaInicio'),
                "fecha_fin": this.fechaReservaString('fechaFinal'),
                "descripcion": "Reserva realizada con éxito",
                "usuario": JSON.parse(localStorage.getItem('currentUser')).email,
                "habitacion": null,
                "sala_conferencia": this.reservaRecepcionista.controls['sala'].value,
                "regimen": parseInt(this.reservaRecepcionista.get('regimen').value),
                "tipo_reserva": 2
              }
            }
            this.service.createReserva(json).subscribe(() => {
              var usuarioActualRol = JSON.parse(localStorage.getItem('currentUser')).role
              this.alertService.success('Reserva realizada con exito', true);
              if(usuarioActualRol === Role.Admin){this.router.navigate(['/admin/reservas']);}
              else {this.router.navigate(['/recepcionista/lista']);}
            });
  }

  habitaciones() {
    console.log(this.lista)
    this.lista = [];
    if(!this.disabledHabitacion){
      
      this.regimenes = [];
      this.tipo = 'habitaciones';
      this.service.getHabitaciones().subscribe(data => {
        for(var d of data){
          this.lista.push({value: d.codigo, viewValue: d.codigo.toString()})
        }
      })
      
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
      this.service.getSalas().subscribe(data => {
        for(var d of data){
          this.lista.push({value: d.codigo, viewValue: d.codigo.toString()})
        }
      })
      for(var regimen of this.serviceSala.regimenes){
        this.regimenes.push({value: regimen.value, viewValue: regimen.viewValue});
      }
    }
  }

}
