import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroEstudiantesRoutingModule } from './registro-estudiantes-routing.module';
import { RegistroEstudiantesComponent } from './registro-estudiantes.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    RegistroEstudiantesComponent
  ],
  imports: [
    CommonModule,
    RegistroEstudiantesRoutingModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class RegistroEstudiantesModule { }
