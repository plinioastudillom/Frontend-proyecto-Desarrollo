import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/service/api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

  displayedColumns = ['teacher',  'assignedSchoolGrade',  'edit', 'delete'];
  teacherList: any[] = [];

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getTeacherList();
  }

  getTeacherList() {
    this.api.get('teacher').subscribe(
      (resp: any) => {
        this.teacherList = resp.teachers;
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  dialogComfirmDelete(studenId: string) {
    Swal.fire({
      title: 'Estas Seguro de eliminar a este maestro?',
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
    this.api.delete(`teacher/${studentId}`).subscribe(
      (resp: any) => {
        this.toastr.success("El maestro ha sido eliminado correctemente!!");
        this.getTeacherList();
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        this.toastr.error(error.error.msg);
      }
    );
  }

  navigateEditStudent(teacherId: string){
    this.router.navigateByUrl(`/maestros/registro-maestros/${teacherId}`);
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
    const fileName = `ListadoMaestros-${new Date().toJSON().slice(0,10).replace(/-/g,'/')}.xlsx`;
    const report = this.teacherList.map(student => ({Nombre: student.name,  Grado: student.assignedSchoolGrade}))
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'test');
		XLSX.writeFile(wb, fileName);
  }

}
