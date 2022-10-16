import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherRegisterComponent } from './teacher-register/teacher-register.component';


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
        redirectTo: 'registro-maestros'
      },
      {
        path: 'registro-maestros',
        component: TeacherRegisterComponent,
        data: {
          title: 'Registro de Maestros'
        }
      },
      {
        path: 'registro-maestros/:id',
        component: TeacherRegisterComponent,
        data: {
          title: 'Registro de Maestros'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {
}
