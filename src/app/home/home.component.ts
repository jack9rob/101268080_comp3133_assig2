import { Component, OnInit } from '@angular/core';

import { Apollo, gql } from 'apollo-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn = false;
  isAdmin = false;
  user = {}
  listings = []
  search:string = ""
  searchOption: string = "none"

  private GET_LISTINGS = gql`{
    getListings{
        _id
        listing_title
        description
        street
        city
        postal_code
        price
        email
    }
  }`

  constructor(private apolloClient: Apollo, private router: Router, private authService: AuthenticationService ) { }

  ngOnInit(): void {
    this.apolloClient.watchQuery<any>({
      query: this.GET_LISTINGS,
      
    }).valueChanges.subscribe(response => {
      console.log(response.data.getListings)
      this.listings = response.data?.getListings
    })

    this.authService.getUsername().subscribe((data) => {
      console.log(data)
      const user:any = data
      if(user.isLoggedIn){
        this.isLoggedIn = true
        if(user.type == "admin") {
          this.isAdmin = true
        }
        this.user = user.user
      }
    })
  }

  filter() {
    switch(this.searchOption) {
      case "title":
        this.searchByTitle()
        break;
      case "city":
        this.searchByCity()
        break;
      case "postalcode":
        this.searchByPostalCode()
        break
      default:
        break;
    }
  }

  searchByTitle() {
    const GET_LISTINGS_TITLE = gql`
      query GetListingByTitle($title: String!){
        getListingByTitle(title: $title) {
          _id
          listing_title
          description
          street
          city
          price
          email
        }
      }
    `

    this.apolloClient.watchQuery<any>({
      query: GET_LISTINGS_TITLE,
      variables: {
        title: this.search
      }
    }).valueChanges.subscribe(response => {
      console.log(response.data.getListingByTitle)
      this.listings = response.data?.getListingByTitle
    })
  }
  
  searchByCity() {
    const GET_LISTINGS_CITY = gql`
      query GetListingByCity($city: String!){
        getListingByCity(city: $city) {
          _id
          listing_title
          description
          street
          city
          postal_code
          price
          email
          username
        }
      }
    `

    this.apolloClient.watchQuery<any>({
      query: GET_LISTINGS_CITY,
      variables: {
        city: this.search
      }
    }).valueChanges.subscribe(response => {
      console.log(response.data.getListingByCity)
      this.listings = response.data?.getListingByCity
    })
  }

  searchByPostalCode() {
    const GET_LISTINGS_POSTALCODE = gql`
      query GetListingByPostalCode($postalCode: String!){
        getListingByPostalCode(postalCode: $postalCode) {
          _id
          listing_title
          description
          street
          city
          postal_code
          price
          email
          username
        }
      }
    `

    this.apolloClient.watchQuery<any>({
      query: GET_LISTINGS_POSTALCODE,
      variables: {
        postalCode: this.search
      }
    }).valueChanges.subscribe(response => {
      console.log(response.data.getListingByPostalCode)
      this.listings = response.data?.getListingByPostalCode
    })
  }

  clearFilter() {
    this.search = ""

    this.apolloClient.watchQuery<any>({
      query: this.GET_LISTINGS,
      
    }).valueChanges.subscribe(response => {
      console.log(response.data.getListings)
      this.listings = response.data?.getListings
    })
  }

}
