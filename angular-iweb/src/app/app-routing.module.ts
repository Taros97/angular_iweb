import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent, LoginComponent, RegisterComponent, AboutComponent, HabitacionesComponent , ProfileComponent, HabitacionComponent, AdminHabitacionDetallesComponent} from './_components';
import { ReservaClienteComponent} from './_components';

import { AdminPanelComponent, AdminSalasComponent, AdminHabitacionesComponent} from './_components';
import { AuthGuard } from './_helpers';
import { SalasComponent, SalaComponent } from './_components';
import { Role } from '@/_models'
import { RecepcionistaReservaComponent } from './_components/recepcionista/recepcionista-reserva/recepcionista-reserva.component';
import { ListaReservasComponent } from './_components/recepcionista/lista-reservas/lista-reservas.component';
import { RecepcionistaPanelComponent } from './_components/recepcionista/recepcionista-panel/recepcionista-panel.component';
import { AdminSalaDetallesComponent } from './_components/admin-panel/admin-sala-detalles/admin-sala-detalles.component';
import { AdminHabitacionCrearComponent } from './_components/admin-panel/admin-habitacion-crear/admin-habitacion-crear.component';
import { AdminSalaCrearComponent } from './_components/admin-panel/admin-sala-crear/admin-sala-crear.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: 'perfil', component: ProfileComponent, canActivate:[AuthGuard]},
  { path: 'habitaciones/:id', component: HabitacionComponent },
  { path: 'reserva', component: ReservaClienteComponent, canActivate:[AuthGuard]},
  { path: 'recepcionista', component: RecepcionistaPanelComponent, canActivate:[AuthGuard], data:{ roles:[Role.Recepcionista]},
  children: [
    { path: '', redirectTo: 'lista', pathMatch: 'full' },
    { path: 'lista', component:  ListaReservasComponent },
    { path: 'reservar', component: RecepcionistaReservaComponent },
  ]},  
  { path: 'admin', component: AdminPanelComponent, canActivate:[AuthGuard], data:{ roles:[Role.Admin]},
  children: [
      { path: '', redirectTo: 'salas', pathMatch: 'full' },
      { path: 'salas', component:  AdminSalasComponent },
      { path: 'salas/:id', component: AdminSalaDetallesComponent  },
      { path: 'habitaciones', component: AdminHabitacionesComponent },
      { path: 'habitaciones/:id', component: AdminHabitacionDetallesComponent },
      { path: 'reservas', component: ListaReservasComponent },
      { path: 'reservar', component: RecepcionistaReservaComponent },
      { path: 'crear-habitacion', component: AdminHabitacionCrearComponent },
      { path: 'crear-sala', component: AdminSalaCrearComponent },
  ]},
  { path: 'salas', component: SalasComponent },
  { path: 'salas/:id', component: SalaComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
