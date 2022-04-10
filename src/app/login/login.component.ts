import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Apollo, gql } from 'apollo-angular';

import {AuthenticationService} from '../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  isLoggedIn = false
  error = false

  loginForm;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { 
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {

  }
  login() {
    if(!this.loginForm.invalid) {
        this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
          (resp) => {
            console.log('resp', resp)
            let message:any = resp
            if(message.status == 500) {
              this.error = true
            } else {
              console.log(message.isLoggedIn)
              localStorage.setItem("token", message.token)
              console.log("user is logged in")
              this.router.navigateByUrl('/')
            }
          }
        )
    }
  }
}
