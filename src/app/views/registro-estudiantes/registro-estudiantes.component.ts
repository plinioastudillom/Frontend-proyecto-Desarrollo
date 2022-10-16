import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/service/api.service';
import  { Student } from '../../core/models/Istudent'
import Swal from 'sweetalert2';

@Component({
  selector: "app-registro-estudiantes",
  templateUrl: "./registro-estudiantes.component.html",
  styleUrls: ["./registro-estudiantes.component.scss"],
})
export class RegistroEstudiantesComponent implements OnInit {
  estudianteFormulario: FormGroup;
  public session = localStorage.getItem("x-token");
  public imagenSubir!: File;
  public imgTemp: any = null;
  public listadoGrados = [
    { grado: 1, nombre: "PRIMERO" },
    { grado: 2, nombre: "SEGUNDO" },
    { grado: 3, nombre: "TERCERO" },
    { grado: 4, nombre: "CUARTO" },
    { grado: 5, nombre: "QUINTO" },
    { grado: 6, nombre: "SEXTO" },
  ];
  studentId!: any;
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.estudianteFormulario = this.createFormGroup();
  }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    if(this.studentId) this.getStudent();
  }

  createFormGroup(data?: Student) {
    return this.fb.group({
      name: [data?.name || null, [Validators.required]],
      lastname: [data?.lastname || null, [Validators.required]],
      schoolGrade: [data?.schoolGrade || null, [Validators.required]],
      img: [data?.img || null],

    });
  }

  cambiarImagen(file: any) {
    this.imagenSubir = file.target.files[0];
  }

  guardarRegistro() {
    this.api.post("students", this.estudianteFormulario.value).subscribe(
      (res: any) => {
        this.toastr.success("SATISFACTORIO", "REGISTRO GUARDADO EXISTOSAMENTE");
        this.estudianteFormulario.reset();
      },
      (error: HttpErrorResponse) => {
        error.status === 404;
        console.log("error");
      }
    );
  }

  guardarImagen() {
    const body: any = new FormData();
    body.append("archivo", this.imagenSubir);
    this.api.post("uploads", body).subscribe(
      (res: any) => {
        this.estudianteFormulario.patchValue({
          img: res.nombre,
        });
        this.guardarRegistro();
      },
      (error: HttpErrorResponse) => {
        this.toastr.error("Error!", error.error.msg);
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
        title: "ERROR",
        icon: "error",
        text: "DEBE ADJUNTAR UN CERTIFICADO",
      });
      return;
    }
    this.guardarImagen();
  }

  getStudent(){
    this.api.get(`students/${this.studentId}`).subscribe(
      (resp: any) => {
        this.estudianteFormulario = this.createFormGroup(resp);
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.estudianteFormulario.controls[controlName].hasError(errorName);
  };
}
