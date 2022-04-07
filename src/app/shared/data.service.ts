import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private BASE_URL = 'http://localhost:4000/graphql'

  constructor(private apollo: Apollo) { }

}
