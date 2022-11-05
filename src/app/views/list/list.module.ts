import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, GridModule } from '@coreui/angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentsListComponent } from './students-list/students-list.component';
import { ListRoutingModule } from './list-routing.module';
import {MatTableModule} from '@angular/material/table';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@NgModule({
  declarations: [
    StudentsListComponent,
    TeacherListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    GridModule,
    HttpClientModule,
    ListRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressBarModule
  ]
})
export class ListModule { }
