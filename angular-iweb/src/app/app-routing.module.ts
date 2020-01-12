import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent, LoginComponent, RegisterComponent, AboutComponent, HabitacionesComponent , ProfileComponent, HabitacionComponent} from './_components';
import { ReservaClienteComponent} from './_components';

import { AdminPanelComponent, AdminSalasComponent, AdminHabitacionesComponent} from './_components';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: 'perfil', component: ProfileComponent, canActivate:[AuthGuard]},
  { path: 'habitaciones/:id', component: HabitacionComponent },
  { path: 'reserva', component: ReservaClienteComponent, canActivate:[AuthGuard]},
  
  { path: 'admin', component: AdminPanelComponent, canActivate:[AuthGuard],
  children: [
      { path: '', redirectTo: 'salas', pathMatch: 'full' },
      { path: 'salas', component:  AdminSalasComponent },
      { path: 'habitaciones', component: AdminHabitacionesComponent },

  ]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
