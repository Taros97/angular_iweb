import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sala } from '@/_models';
import { AdminHabitacionesService, AlertService, AdminSalasService } from '@/_services';
import { Location } from '@angular/common';


@Component({
  selector: 'app-admin-sala-crear',
  templateUrl: './admin-sala-crear.component.html',
  styleUrls: ['./admin-sala-crear.component.css']
})
export class AdminSalaCrearComponent implements OnInit {
  salaForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, 
    private service: AdminSalasService,
    private alertService: AlertService,
    private locate: Location,) { }

  ngOnInit() {
    this.salaForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      proyector: [false, Validators.required],
      microfono: [false, Validators.required],
      superficie: ['', Validators.required],
      precio: ['', Validators.required],
      pizarra: [false, Validators.required],
      mesas: ['', Validators.required],
      asientos: ['', Validators.required],   
    });
    
  }

  get f() { return this.salaForm.controls; }

  pene() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.salaForm.invalid) {
      return;
    }

    /// LAMADA AL SERVICIO PARA CREAR LA HABITACION
    var salaCrear : Sala = this.salaForm.value;
    // CODIGO??????
    salaCrear.codigo = 60;
    salaCrear.puntuacion = 5;
    this.service.createSala(salaCrear).subscribe(data => {
      this.locate.back();
    });
  }
}
