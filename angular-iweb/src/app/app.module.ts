import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMetro4Module,
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
    ProfileComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider // Esto es mientras no tengamos la api
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
