import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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
  loading = false;
  submitted = false;
  returnUrl: string = '/';

  username: string = ""
  password: string = ""
  isLoggedIn = false
  error = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apolloClient: Apollo,
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {

  }
  login() {
    if(this.username && this.password) {
        this.authService.login(this.username, this.password).subscribe(
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
