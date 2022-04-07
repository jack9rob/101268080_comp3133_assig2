import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public getCurrentUser() {

  }

  public getUsername() {
    let token = localStorage.getItem("token")
    if(!token) {
      token = "token"
    }
    console.log(localStorage.getItem("token"))
    let headers = new HttpHeaders()
    headers = headers.set('x-access-token', token)
     return this.http.get('http://localhost:4000/api/auth/getUsername', {
      headers: headers
    })
  }

  public login(username: string, password: string) {
    return this.http.post('http://localhost:4000/api/auth/login', {username, password})
  }

  public logout() {
    localStorage.removeItem('token')
  }
}
