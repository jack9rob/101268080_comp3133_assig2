import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthenticationService } from '../services/authentication.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  bookings = []
  isLoggedIn = false
  user: any = {}

  GET_BOOKINGS = gql`
  query getBookingsByUser($username: String!){
    getBookingsByUser(username: $username) {
      listing_id
      booking_date
      booking_start
      booking_end
    }
  }`
  

  constructor(
    private apolloClient: Apollo,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.authService.getUsername().subscribe((data) => {
      console.log(data)
      const resp:any = data
      if(resp.isLoggedIn){
        // user is logged in
        this.isLoggedIn = true
        this.user = resp.user
        // get users bookings
        this.apolloClient.watchQuery<any>({
          query: this.GET_BOOKINGS,
          variables: {
            username: this.user.username
          }
        }).valueChanges.subscribe(res => {
          console.log(res.data)
          this.bookings = res.data.getBookingsByUser
        })
      } else {
        // return user to login page if not logged in
        this.router.navigateByUrl("/login")
      }
    })
  }
}
