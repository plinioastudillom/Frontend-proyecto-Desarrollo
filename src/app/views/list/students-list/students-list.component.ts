import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/service/api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent implements OnInit {
  displayedColumns = ['student', 'teacher', 'grade', 'edit', 'delete'];
  studentList: any[] = [];
  documentTypes: any[]=[];
  progressBarShow: boolean = false;
  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getStudentList();
  }

  getStudentList() {
    this.progressBarShow = true;
    this.api.get('students').subscribe(
      (resp: any) => {
        this.studentList = resp.students;
        this.documentTypes = resp.typeDocuments;
        this.progressBarShow = false;
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.progressBarShow = false;
        this.toastr.error(error.error.msg);
      }
    );
  }

  dialogComfirmDelete(studenId: string) {
    Swal.fire({
      title: 'Estas Seguro de eliminar este estudiante?',
      text: "No podrá revertir esto.!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(studenId);
      }
    });
  }

  delete(studentId: string) {
    this.api.delete(`students/${studentId}`).subscribe(
      (resp: any) => {
        this.toastr.success("El alumno ha sido eliminado correctemente!!");
        this.getStudentList();
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  navigateEditStudent(studentId: string){
    this.router.navigateByUrl(`/estudiantes/Estudiantes/${studentId}`);
  }

  nameSchoolGrade(grade: any): string {
    let nameGrade = '';
    switch (grade) {
      case "1":
        nameGrade = 'Primero';
        break;
      case "2":
        nameGrade = 'Segundo';
        break;
      case "3":
        nameGrade = 'Tercero';
        break;
      case "4":
        nameGrade = 'Cuarto';
        break;
      case "5":
        nameGrade = 'Quinto';
        break;
      case "6":
        nameGrade = 'Sexto';
        break;
      default:
        break;
    }
    return nameGrade;
  }

  exportToExcel(){
    const fileName = `ListadoEstudiantes${new Date().toJSON().slice(0,10).replace(/-/g,'/')}.xlsx`;
    const report = this.studentList.map((student) => ({
      Nombre: student.name,
      Apellido: student.lastname,
      Grado: this.nameSchoolGrade(student.teacher.assignedSchoolGrade),
      Maestro_A_Cargo: student.teacher.name,
      Adjuntos: this.getDocAttach(student.documents),
      No_Adjuntos: this.getDocNoAttach(student.documents)
    }));
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
		XLSX.writeFile(wb, fileName);
  }

  getDocAttach(docs:any[]){
    if(docs.length <= 0) return "";
    let documents = docs.map(doc => ( doc.documentId.name));
    return documents.toString();
  }

  getDocNoAttach(docs:any[]){
    if(docs.length <= 0) return "";
    let documents = docs.map(doc => ( doc.documentId.name));
    let noAttach = this.documentTypes.map(type => (type.name)).filter(type => !documents.includes(type));
    return noAttach.toString();
  }

}
