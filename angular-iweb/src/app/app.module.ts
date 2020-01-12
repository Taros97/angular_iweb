import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { fakeBackendProvider } from './_helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AboutComponent } from './_components/about/about.component';
import { NgMetro4Module } from 'ng-metro4';
import { HabitacionesComponent } from './_components/habitaciones/habitaciones.component';
import { FooterComponent } from './_components';
import { ScrollToTopComponent } from './_components/scroll-to-top/scroll-to-top.component';
import { ProfileComponent } from './_components/profile/profile.component';
import { Ng5SliderModule } from 'ng5-slider';
import { HabitacionComponent } from './_components/habitacion/habitacion.component';
import { ReservaClienteComponent } from './_components/reserva-cliente/reserva-cliente.component';
import { AdminPanelComponent } from './_components/admin-panel/admin-panel.component';
import { NgbModule, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbdSortableHeader } from './_directives/sortable.directive';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule, MatCardModule } from '@angular/material';
import { AdminSalasComponent } from './_components/admin-panel/admin-salas/admin-salas.component';
import { AdminHabitacionesComponent } from './_components/admin-panel/admin-habitaciones/admin-habitaciones.component';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { SalasComponent } from './_components/salas/salas.component';
import { SalaComponent } from './_components/sala/sala.component';
import { RecepcionistaReservaComponent } from './_components/recepcionista-reserva/recepcionista-reserva.component';


registerLocaleData(localeEs, 'es');

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMetro4Module,
    Ng5SliderModule,
    NgbModule,
    CommonModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AboutComponent,
    HabitacionesComponent,
    FooterComponent,
    ScrollToTopComponent,
    ProfileComponent,
    HabitacionComponent,
    ReservaClienteComponent,
    AdminPanelComponent,
    NgbdSortableHeader,
    AdminSalasComponent,
    AdminHabitacionesComponent,
    SalasComponent,
    SalaComponent,
    RecepcionistaReservaComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es'},
    fakeBackendProvider // Esto es mientras no tengamos la api
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
