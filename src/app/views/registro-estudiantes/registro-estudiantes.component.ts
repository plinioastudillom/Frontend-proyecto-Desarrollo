import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { throws } from 'assert';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/service/api.service';
import Swal from 'sweetalert2';
import { DocumentTypes } from '../../core/models/IdocumentType';
import { Student } from '../../core/models/Istudent';
import { Teacher } from '../../core/models/Iteacher';


@Component({
  selector: 'app-registro-estudiantes',
  templateUrl: './registro-estudiantes.component.html',
  styleUrls: ['./registro-estudiantes.component.scss'],
})
export class RegistroEstudiantesComponent implements OnInit {
  estudianteFormulario: FormGroup;
  public session = localStorage.getItem('x-token');
  public imagenSubir!: File;
  public imgTemp: any = null;
  public teachers: Teacher[] = [];
  public documentTypes: DocumentTypes[] = [];
  public documents: any[] = [];
  displayedColumns = ['documentType', 'view', 'delete', 'print'];
  public showDocument = false;
  public isLocal = false;
  public extension: string = '';
  studentId!: any;
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.estudianteFormulario = this.createFormGroup();
  }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.getTeachers();
    this.getDocumentTypes();
    if (this.studentId) this.getStudent();
  }

  createFormGroup(data?: Student) {
    return this.fb.group({
      name: [data?.name || null, [Validators.required]],
      lastname: [data?.lastname || null, [Validators.required]],
      teacher: [data?.teacher._id || null, [Validators.required]],
      documentType: null,
      img: null,
    });
  }

  cambiarImagen(file: any) {
    //this.imagenSubir = file.target.files[0];
    const { documentType } = this.estudianteFormulario.value;
    this.documents.push({
      type: documentType,
      image: file.target.files[0],
      src: this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(file.target.files[0])
      ),
      show: false,
    });
    this.documents = [...this.documents];
  }

  guardarRegistro() {
    this.api.post('students', this.estudianteFormulario.value).subscribe(
      (res: any) => {
        this.studentId = res._id;
        this.toastr.success('SATISFACTORIO', 'REGISTRO GUARDADO EXISTOSAMENTE');
        this.setImageStudent();
        this.estudianteFormulario.reset();
      },
      (error: HttpErrorResponse) => {
        error.status === 404;
        console.log('error');
      }
    );
  }

  editarEstudiante(){
    this.api.put(`students/${this.studentId}`, this.estudianteFormulario.value).subscribe(
      (res: any) => {
        this.toastr.success('SATISFACTORIO', 'REGISTRO EDITADO EXISTOSAMENTE');
        this.setImageStudent();
        this.estudianteFormulario.reset();
      },
      (error: HttpErrorResponse) => {
        error.status === 404;
        this.toastr.error('Error!', error.error.msg);
      }
    );
  }

  guardarImagen(doc: any) {
    const body: any = new FormData();
    body.append('archivo', doc.image);
    this.api.post('uploads', body).subscribe(
      (res: any) => {
        this.saveImageStudent(doc, res.nombre);
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
    (this.studentId)?this.editarEstudiante(): this.guardarRegistro();
  }

  setImageStudent(){
    this.documents.filter(doc => doc.image != null).forEach(doc => {
      this.guardarImagen(doc);
    });
  }

  saveImageStudent(doc: any, imageName: string){
    this.api.post('studentDocuments', {
      studenId: this.studentId,
      documentId: doc.type.uid,
      documentName: imageName
    }).subscribe(
      (res: any) => {
        this.documents = [];
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Error!', error.error.msg);
      }
    );
  }

  getStudent() {
    this.api.get(`students/${this.studentId}`).subscribe(
      (resp: any) => {
        this.estudianteFormulario = this.createFormGroup(resp);
        this.getStudentDocument(this.studentId);
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  getTeachers() {
    this.api.get(`teacher`).subscribe(
      (resp: any) => {
        this.teachers = resp.teachers;
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  getDocumentTypes() {
    this.api.get(`documentType`).subscribe(
      (resp: any) => {
        this.documentTypes = resp.documentsTypes;
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  getStudentDocument(student: string){
    this.api.get(`studentDocuments/${student}`).subscribe(
      (resp: any) => {
        let docs: any[] = resp;
        this.documents = docs.map((doc) => ({
          type: doc.documentId,
          image: null,
          src: this.sanitizer.bypassSecurityTrustResourceUrl(
            this.api.getPathImage()+doc.documentName
          ),
          show: false,
          nameImage: doc.documentName
        }));
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }


  getImage(nameImage: string){
    this.api.get(`uploads/students/${nameImage}`).subscribe(
      (resp: any) => {
        this.imgTemp =resp;
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }


  showImage(image: any) {
    image.show = !image.show;
    this.showDocument = !this.showDocument;
    this.imgTemp = null;
    if(image.show){
        this.imgTemp = image.src;
        if(image.image)this.isLocal = true;
        else {
          this.isLocal = false;
          this.extension =image.nameImage.substr(image.nameImage.lastIndexOf('.') + 1);
        }
    }
  }

  deleteItem(itemToDelete: any): void {
    this.documents = this.documents.filter((item) => item !== itemToDelete);
    this.toastr.error('Archivo eliminado correctamente');
  }

  deletePermanentlyImage(itemToDelete: any){
    this.api.delete(`uploads/students/${itemToDelete.type._id}/${itemToDelete.nameImage}`).subscribe(
      (resp: any) => {
        this.deleteItem(itemToDelete);
        this.toastr.error('Archivo eliminado correctamente');
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.msg);
      }
    );
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.estudianteFormulario.controls[controlName].hasError(errorName);
  };


  print(image: any) {
    //printJS(this.api.getPathImage()+image.nameImage);
  }
}
