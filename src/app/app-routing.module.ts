import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'Registro', pathMatch: 'full'
  },
  {
    path: 'Registro',
    loadChildren: () => import('./registro-estudiantes/registro-estudiantes.module').then(m => m.RegistroEstudiantesModule)
  },
  {
    path: 'Login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
