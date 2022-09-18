import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ApiService } from '../core/service/api.service';
import { HttpErrorResponse } from '@angular/common/http';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [ Validators.required, Validators.email ] ],
    password: ['', Validators.required ],
    remember: [false]
  });


  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: ApiService,
               private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton();
  }


  login() {

    this.usuarioService.post( this.loginForm.value )
      .subscribe( (resp: any) => {



        // Navegar al Dashboard
        this.router.navigateByUrl('/');

      }, (error: HttpErrorResponse) => {
        // Si sucede un error
        Swal.fire('Error', error.error.msg, 'error' );
      });

  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });



  }




}
