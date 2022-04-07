import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  passwordError = false;
  usernameError = false;

  CREATE_USER =  gql` 
    mutation CreateUser($username: String, $firstname: String, $lastname: String, $password: String, $email: String, $type: String){
      createUser(username: $username, firstname: $firstname, lastname: $lastname, password: $password, email: $email, type: $type) {
        _id
        username
        email
      }
    }`

  constructor(private formBuilder: FormBuilder, private router: Router, private apolloClient: Apollo) { 
    this.registerForm = formBuilder.group({
      username: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  registerUser() {
    // if form is valid
    if(!this.registerForm.invalid) {
      // if passwords match
      if(this.registerForm.value.password == this.registerForm.value.confirmPassword) {
        // create user
        this.apolloClient.mutate({
          mutation: this.CREATE_USER,
          variables: {
            username: this.registerForm.value.username,
            firstname: this.registerForm.value.firstname,
            lastname: this.registerForm.value.lastname,
            password: this.registerForm.value.password,
            email: this.registerForm.value.email,
            type: this.registerForm.value.type
          }
        }).subscribe(resp => {
          let response: any = resp
          console.log(response.data.createUser)
          if(!response.data.createUser){
            // username/email exists
            this.usernameError = true
          } else {
            this.router.navigateByUrl('/login')
          }
        })
      } else {
        this.passwordError = true
      }
    }
  }

}
