import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ApiService } from '../core/service/api.service';

@Component({
  selector: 'app-registro-estudiantes',
  templateUrl: './registro-estudiantes.component.html',
  styleUrls: ['./registro-estudiantes.component.scss'],
})
export class RegistroEstudiantesComponent implements OnInit {
  estudianteFormulario: FormGroup;

  public imagenSubir!: File;
  public imgTemp: any = null;
  public listadoGrados = [
    { grado: 1, nombre: 'PRIMERO' },
    { grado: 2, nombre: 'SEGUNDO' },
    { grado: 3, nombre: 'TERCERO' },
    { grado: 4, nombre: 'CUARTO' },
    { grado: 5, nombre: 'QUINTO' },
    { grado: 6, nombre: 'SEXTO' }
  ];
  constructor(private api: ApiService, private fb: FormBuilder, private toastr: ToastrService) {
    this.estudianteFormulario = this.createFormGroup();
  }

  ngOnInit(): void {}

  createFormGroup(data?: any) {
    return this.fb.group({
      name: [data?.name || null, [Validators.required]],
      lastname: [data?.lastname || null, [Validators.required]],
      schoolGrade: [data?.schoolGrade || null, [Validators.required]],
      img: [data?.img || null],
      user: '63265aaba25e7b3a206905e9',
    });
  }

  cambiarImagen(file: any) {
    this.imagenSubir = file.target.files[0];
  }

  guardarRegistro() {

    this.api.post('students', this.estudianteFormulario.value).subscribe(
      (res: any) => {
        this.toastr.success('SATISFACTORIO', 'REGISTRO GUARDADO EXISTOSAMENTE');
        this.estudianteFormulario.reset();

      },
      (error: HttpErrorResponse) => {
        error.status === 404;
        console.log('error');
      }
    );
  }

  guardarImagen() {
    const body: any = new FormData();
    body.append('archivo', this.imagenSubir);
    this.api.post('uploads', body).subscribe(
      (res: any) => {
        this.estudianteFormulario.patchValue({
          img: res.nombre,
        });
        this.guardarRegistro();
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Error!', error.error.msg);
      }
    );
  }
  guardar() {
    if (this.estudianteFormulario.invalid) {
      this.estudianteFormulario.markAllAsTouched();
      return;
    }
    if (this.imagenSubir == null) {
      Swal.fire({
        title: 'ERROR',
        icon: 'error',
        text: 'DEBE ADJUNTAR UN CERTIFICADO',
      });
      return;
    }
    this.guardarImagen();
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.estudianteFormulario.controls[controlName].hasError(errorName);
  };
}
