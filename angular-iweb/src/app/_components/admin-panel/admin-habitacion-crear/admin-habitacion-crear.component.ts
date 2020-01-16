import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Habitacion } from '@/_models';
import { AdminHabitacionesService, AlertService } from '@/_services';
import { Location } from '@angular/common';
interface Vista {
  value: string;
  viewValue: string;
}
function ObtenerVistas(habitaciones: Habitacion[]){
  var aux: string[] = [];
  for(let habitacion of habitaciones){
    if(!aux.includes(habitacion.vistas)){
      aux.push(habitacion.vistas);
    }
  }
  var vistas: Vista[] = [];
  vistas.push({value: '', viewValue: 'Todas'})
  for(let vista of aux){
    vistas.push({value: vista, viewValue: vista});
  }
  return vistas;
}


@Component({
  selector: 'app-admin-habitacion-crear',
  templateUrl: './admin-habitacion-crear.component.html',
  styleUrls: ['./admin-habitacion-crear.component.css']
})
export class AdminHabitacionCrearComponent implements OnInit {
  habitacionForm: FormGroup;
  vistas: Vista[] = [];
  submitted = false;

  constructor(private formBuilder: FormBuilder, 
    private service: AdminHabitacionesService,
    private alertService: AlertService,
    private locate: Location,) { }

  ngOnInit() {
    this.habitacionForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      plazas: ['', Validators.required],
      vistas: ['', Validators.required],
      superficie: ['', Validators.required],
      precio: ['', Validators.required],
      categoria: ['', Validators.required],
      wifi: ['', Validators.required],    
    });
    this.service.getHabitacionesVistas().subscribe(data =>{
      this.vistas = ObtenerVistas(data);
    })
    
  }

  get f() { return this.habitacionForm.controls; }

  onSubmit() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.habitacionForm.invalid) {
      return;
    }

    
    /// LAMADA AL SERVICIO PARA CREAR LA HABITACION
    var habitacionCrear : Habitacion = this.habitacionForm.value;
    // CODIGO??????
    habitacionCrear.codigo = 60;
    habitacionCrear.puntuacion = 5;
    this.service.createHabitacion(habitacionCrear).subscribe(data => {
      this.locate.back();
    });
  }
}
