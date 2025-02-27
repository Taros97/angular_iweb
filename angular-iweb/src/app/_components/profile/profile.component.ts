import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { User , Reserva } from '@/_models';
import { USUARIO , RESERVAS} from '@/_mockups';

import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { ProfileService, AlertService } from '@/_services';
import { NgbdSortableHeader, SortEvent } from '@/_directives/sortable.directive';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService, DecimalPipe]
})
export class ProfileComponent implements OnInit {

  reservas$: Observable<Reserva[]>;
  total$: Observable<number>;

  user: User = new User();
  //reservas = RESERVAS;
  edit = false;
  profileForm: FormGroup;
  submitted = false;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private formBuilder: FormBuilder,public service: ProfileService,  private alertService: AlertService) {
    this.reservas$ = service.reservas$;
    this.total$ = service.total$;
  }

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

  get f() { return this.profileForm.controls; }

  ngOnInit() {
    this.service.getProfile().subscribe(data => {
      this.user = data;
      this.profileForm = this.formBuilder.group({
        nombre: [this.user.nombre, Validators.required],
        apellidos: [this.user.apellidos, Validators.required],
        email: [this.user.email, Validators.required],
        password: [this.user.password, Validators.required],
        dni: [this.user.dni, Validators.required],
        telefono: [this.user.telefono, Validators.required],
        nacionalidad: [this.user.nacionalidad, Validators.required],
        direccion: [this.user.direccion, Validators.required],
      });
    })
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      direccion: ['', Validators.required],
    });
    /**this.service.getProfile().subscribe(data => {
      this.user = data;
      this.profileForm = this.formBuilder.group({
        nombre: [this.user.nombre, Validators.required],
        apellidos: [this.user.apellidos, Validators.required],
        email: [this.user.apellidos, Validators.required],
        password: [this.user.password, Validators.required],
        dni: [this.user.dni, Validators.required],
        telefono: [this.user.telefono, Validators.required],
        nacionalidad: [this.user.nacionalidad, Validators.required],
        direccion: [this.user.direccion, Validators.required],
      });
    }
    
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      direccion: ['', Validators.required],
    });
      
      });*/
  }

  onSubmit() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    console.log(this.profileForm.value)
  }
}

