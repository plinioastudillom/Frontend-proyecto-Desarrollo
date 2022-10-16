import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/service/api.service';

@Component({
  selector: 'app-teacher-register',
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.scss']
})
export class TeacherRegisterComponent implements OnInit {
  public listadoGrados = [
    { grado: 1, nombre: "PRIMERO" },
    { grado: 2, nombre: "SEGUNDO" },
    { grado: 3, nombre: "TERCERO" },
    { grado: 4, nombre: "CUARTO" },
    { grado: 5, nombre: "QUINTO" },
    { grado: 6, nombre: "SEXTO" },
  ];

  teacherForm: FormGroup;
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.teacherForm = this.createFormGroup();
   }

  ngOnInit(): void {
  }

  createFormGroup(data?: any) {
    return this.fb.group({
      name: [data?.name || null, [Validators.required]],
      assignedSchoolGrade: [data?.assignedSchoolGrade || null, [Validators.required]],
      birth: [data?.birth || null, [Validators.required]],

    });
  }

  saveTeacher(){
    if(this.teacherForm.invalid){
      this.teacherForm.markAllAsTouched();
      return;
    }
    this.api.post("teacher", this.teacherForm.value).subscribe(
      (res: any) => {
        this.toastr.success("SATISFACTORIO", "REGISTRO GUARDADO EXISTOSAMENTE");
        this.teacherForm.reset();
      },
      (error: HttpErrorResponse) => {
        error.status === 404;
        this.toastr.error(error.error.msg);
      }
    );
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.teacherForm.controls[controlName].hasError(errorName);
  };

}
