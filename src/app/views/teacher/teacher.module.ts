import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, GridModule } from '@coreui/angular';
import { TeacherRegisterComponent } from './teacher-register/teacher-register.component';
import { TeacherRoutingModule } from "./teacher-routing.module";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [
    TeacherRegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    GridModule,
    HttpClientModule,
    TeacherRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class TeacherModule { }
