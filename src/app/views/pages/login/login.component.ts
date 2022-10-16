import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: ApiService
  ) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit(): void {
      const session = localStorage.getItem("x-token");
      if(session) localStorage.clear();
  }

  login() {
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.usuarioService.post('auth/login', this.loginForm.value).subscribe(
      (resp: any) => {
        localStorage.setItem('x-token', resp.token);
        this.router.navigateByUrl('/listado/listado-alumnos');
      },
      (error: HttpErrorResponse) => {
        // Si sucede un error
        Swal.fire('Error', error.error.msg, 'error');
      }
    );
  }

  createFormGroup(data?: any) {
    return this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }
}
