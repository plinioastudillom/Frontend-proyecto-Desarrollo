import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/service/api.service';
import { DocumentTypes } from '../../core/models/IdocumentType';
import { Student } from '../../core/models/Istudent';
import { Teacher } from '../../core/models/Iteacher';
import print from "print-js";
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
      documents: null,
    });
  }

  cambiarImagen(file: any) {
    //this.imagenSubir = file.target.files[0];
    const { documentType } = this.estudianteFormulario.value;

    let file2 = <File>file.target.files[0];
    const reader = new FileReader();
    let base64String = "";
    reader.onload = (e: any) => {
      //const bytes = e.target.result.split('base64,')[1];
     // let byteArray = this.convertDataURIToBinary(reader.result);
      let bynaryString: any = reader.result;
      base64String = btoa(bynaryString);
      this.documents.push({
        type: documentType,
        image: file.target.files[0],
        src: this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(file.target.files[0])
        ),
        show: false,
        student_doc: base64String,
        base64: base64String,
        extension: file.target.files[0].type
      });
      //console.log(byteArray);
      this.documents = [...this.documents];
    };
    reader.readAsBinaryString(file2);



  }

  convertDataURIToBinary(dataURI: any) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    console.log(base64);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  convertDataURIToBinary2(dataURI: any) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);

    return base64;
  }

  guardarRegistro() {
    const docs = this.documents.map( doc => ({documentId: doc.type.uid, student_doc: doc.base64, extension: doc.extension}));
    this.estudianteFormulario.patchValue({
      documents: docs
    });
    //console.log(this.estudianteFormulario.value);
    this.api.post('students', this.estudianteFormulario.value).subscribe(
      (res: any) => {
        this.studentId = res._id;
        this.toastr.success('SATISFACTORIO', 'REGISTRO GUARDADO EXISTOSAMENTE');
       // this.setImageStudent();
        this.estudianteFormulario.reset();
      },
      (error: HttpErrorResponse) => {
        error.status === 404;
        console.log('error');
      }
    );
  }

  editarEstudiante(){
    const docs = this.documents.map( doc => ({documentId: doc.type._id || doc.type.uid, student_doc: doc.student_doc, extension: doc.extension}));
    this.estudianteFormulario.patchValue({
      documents: docs
    });
    this.api.put(`students/${this.studentId}`, this.estudianteFormulario.value).subscribe(
      (res: any) => {
        this.toastr.success('SATISFACTORIO', 'REGISTRO EDITADO EXISTOSAMENTE');
        //this.setImageStudent();
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
        this.documents = resp.documents.map((doc: any) => ({
          type: doc.documentId,
          extension: doc.extension,
          student_doc: doc.student_doc,
          _id: doc._id,
        }));
        //this.getStudentDocument(this.studentId);
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
        var byteArray = new Uint8Array(atob(image.student_doc).split("").map((char) => char.charCodeAt(0)));
        const blob = new Blob([byteArray], {type: image.extension});

        this.imgTemp =  this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(blob)
        );
        //this.imgTemp = image.src;
        this.isLocal = true;
        // if(image.image)this.isLocal = true;
        // else {
        //   this.isLocal = false;
        //   this.extension =image.nameImage.substr(image.nameImage.lastIndexOf('.') + 1);
        // }
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
    if(image.extension == "application/pdf"){
      print({printable: image.student_doc, type: "pdf", base64: true, showModal: true});
    }else{
      let byteArray = new Uint8Array(atob(image.student_doc).split('').map((char) => char.charCodeAt(0)));
      const blob = new Blob([byteArray], { type: image.extension });
      let myImage = window.URL.createObjectURL(blob);
      print({
        printable: myImage,
        type: 'image',
        style: 'img {max-width:100%; height:auto};',
      });
    }
  }
}
