import {Component, OnInit} from '@angular/core';
import {AuthServiceService} from "../../Service/auth-service.service";
import {User} from "../../Classes/user";
import {OrderService} from "../../Service/order.service";
import {CheckoutService} from "../../Service/checkout.service";
import {Orders} from "../../Classes/orders";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{

    userName: string = '';
    userProfileImage: string = '';
    email: string = '';
    lastName: string = '';
    id!:number;
    listOfOrders!:Array<Orders>;

    constructor(private authService:AuthServiceService,private checkoutService:CheckoutService,private router:Router) {
    }

    ngOnInit(): void {
      this.fetchData();
      this.fetchOrders();

    }

  fetchData() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.userName = user.given_name ?? '';
      this.userProfileImage = user.picture ?? '';
      this.email = user.email ?? '';
      this.lastName = user.family_name ?? '';

      let loginUser = new User(this.userName,this.lastName,"",this.email,"male");
    } else {
      // Handle the case where the user is not logged in or sessionStorage is empty
      console.error('No logged-in user found');
    }
  }

    signOut(){
      this.authService.signOut();
      localStorage.removeItem("listOfItems");
      sessionStorage.removeItem("loggedInUser");

    }

    fetchOrders(){
      this.checkoutService.findUserByUserId(this.email).subscribe(
        (data)=>{
          this.id= data;
          if(data){
            this.checkoutService.findOrdersByUserId(this.id).subscribe(
              (data)=>{
                this.listOfOrders = data;
              }

            );
          }
        }
      )
    }

  viewOrder(orderId: number) {
    this.router.navigate(['receipt/'+orderId])

  }
}
