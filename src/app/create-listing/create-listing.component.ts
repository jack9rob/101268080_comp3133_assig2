import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit {

  listingForm;
  user: any
  isLoggedIn = false;

  CREATE_LISTING = gql`
  mutation CreateListing($listing_title: String!, $description: String!, $street: String!, $city: String!, $postal_code: String!, $price: Float!, $email: String!, $username: String!){
      createListing(listing_title: $listing_title, description: $description, street: $street, city: $city, postal_code: $postal_code, price: $price, email: $email, username: $username) {
          _id
          listing_title
          description
        }
    }
  `

  constructor(private formBuilder: FormBuilder, private authService: 
    AuthenticationService, private router: Router, private apolloClient: Apollo) { 
    this.listingForm = formBuilder.group({
      listing_title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.authService.getUsername().subscribe((data) => {
      console.log(data)
      const user:any = data
      if(user.isLoggedIn){
        this.isLoggedIn = true
        this.user = user.user
        this.listingForm.controls['username'].setValue(this.user.username)
        if(this.user.type != "admin") {
          this.router.navigateByUrl('/')
        }
      } else {
        this.router.navigateByUrl('/login')
      }
    })
  }

  saveListing() {
    console.log(this.listingForm.value.listing_title)
    if(!this.listingForm.invalid) {
      this.apolloClient.mutate({
        mutation: this.CREATE_LISTING,
        variables: {
          listing_title: this.listingForm.value.listing_title,
          description: this.listingForm.value.description,
          street: this.listingForm.value.street,
          city: this.listingForm.value.city,
          postal_code: this.listingForm.value.postal_code,
          price: this.listingForm.value.price,
          email: this.listingForm.value.email,
          username: this.listingForm.value.username,
        }
      }).subscribe(resp => {
        console.log(resp)
        this.router.navigateByUrl('/')
      })
    }
  }

}
