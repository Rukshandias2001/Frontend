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
    pages:number =0;
    totalEelements:number=0;

    constructor(private authService:AuthServiceService,private checkoutService:CheckoutService,private router:Router) {
    }

    ngOnInit(): void {
      this.fetchData();
      this.fetchOrders(0,20);

    }

  fetchData() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.userName = user.given_name ?? '';
      this.userProfileImage = user.picture ?? '';
      this.email = user.email ?? '';
      this.lastName = user.family_name ?? '';
      this.checkoutService.findUserByUserId(this.email).subscribe((data)=>{
        console.log(data);
      })




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

    fetchOrders(page:number,size:number){
      this.checkoutService.findUserByUserId(this.email).subscribe(
        (data)=>{
          this.id= data;
          console.log(this.id)
          // @ts-ignore
          this.checkoutService.findUserByRole(data).subscribe((data)=>{
            console.log(data)
            sessionStorage.setItem("Role",JSON.stringify(data[0]));
          })
          if(data){
            this.checkoutService.findOrdersByUserId(this.id,page,size).subscribe(
              (data1)=>{
                if(data1){
                  this.listOfOrders = data1;

                }

              }

            );
            this.checkoutService.findOrdersByUserIdGetNumber(this.id,page,size).subscribe(
              (data)=>{
                this.pages =data.totalPages;

              }

            )
          }
        }
      )
    }

  viewOrder(orderId: number) {
    this.router.navigate(['receipt/'+orderId])

  }
}
