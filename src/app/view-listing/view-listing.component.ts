import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.css']
})
export class ViewListingComponent implements OnInit {

  id:any = "62094fa22cf4"
  isBooked = false;
  listing: any
  user: any = {}
  isLoggedIn = false
  startDate: string = ''
  endDate: string = ''
  loading: boolean = true
  
  GET_LiSTING = gql`
  query GetListingById($id: String!){
    getListingById(id: $id) {
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

  ADD_BOOKING = gql`
    mutation CreateBooking($listing_id: String!, $booking_date: String!, $booking_start: String!, $booking_end: String! $username: String!){
      createBooking(listing_id: $listing_id, booking_date: $booking_date, booking_start: $booking_start, booking_end: $booking_end, username: $username) {
        booking_start,
        booking_end
      }
    }
  `  

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private apolloClient: Apollo,
    private authService: AuthenticationService
    ) { }

  ngOnInit(): void {

    // get user
    this.authService.getUsername().subscribe((data) => {
      console.log(data)
      const user:any = data
      if(user.isLoggedIn){
        this.isLoggedIn = true
        this.user = user.user
      } else {
        this.router.navigateByUrl('/login')
      }
    })

    this.id = this.route.snapshot.paramMap.get('id')
    console.log(this.id)
    
    this.apolloClient.watchQuery<any>({
      query: this.GET_LiSTING,
      variables:{
        id: this.id
      }
    }).valueChanges.subscribe(res => {
      console.log(res.data)
      this.listing = res.data.getListingById
      this.loading = false
    })
    
  }

  bookStart() {
    if(this.startDate != '' && this.endDate != '') {
      this.isBooked = true
    }
  }

  bookListing() {
    // call to book
    let date: any = new Date()
    let tempStart:any = new Date(this.startDate)
    let tempEnd:any = new Date(this.endDate)
    tempStart = tempStart.toLocaleDateString()
    tempEnd = tempEnd.toLocaleDateString()
    date = date.toLocaleDateString()
    console.log(date)
    console.log(tempStart)
    console.log(tempEnd)
    this.apolloClient.mutate({
      mutation: this.ADD_BOOKING,
      variables: {
        listing_id: this.listing.listing_id,
        booking_date: date,
        booking_start: tempStart,
        booking_end: tempEnd,
        username: this.user.username
      }
    }).subscribe(resp => {
      console.log(resp)
    })
    //this.router.navigateByUrl('/bookings')
    
  }

  cancel() {
    this.isBooked = false
  }

}
