import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsListComponent } from './students-list/students-list.component';
import { TeacherListComponent } from "./teacher-list/teacher-list.component";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maestros'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'listado-alumnos'
      },
      {
        path: 'listado-alumnos',
        component: StudentsListComponent,
        data: {
          title: 'Listado de Alumnos'
        }
      },
      {
        path: 'listado-maestros',
        component: TeacherListComponent,
        data: {
          title: 'Listado de Maestros'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule {
}
