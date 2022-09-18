import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroEstudiantesComponent } from './registro-estudiantes.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'Estudiantes', pathMatch: 'full'
  },
  {
    path: 'Estudiantes',
    component:  RegistroEstudiantesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroEstudiantesRoutingModule { }
