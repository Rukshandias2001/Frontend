import {Component, OnInit} from '@angular/core';
import {Orders} from "../../Classes/orders";
import {OrderService} from "../../Service/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CheckoutService} from "../../Service/checkout.service";
import {Product} from "../../Classes/products";
import {User} from "../../Classes/user";
import {formatDate} from "@angular/common";
import {OrderedList} from "../../Classes/ordered-list";

@Component({
  selector: 'app-payment-reciept',
  templateUrl: './payment-reciept.component.html',
  styleUrls: ['./payment-reciept.component.css']
})
export class PaymentRecieptComponent implements OnInit{
  order!:Orders;
  expiryDate!:Date;
  paidDate!:Date;
  price!:number;
  productList!:Array<OrderedList>
  cardType!:string
  newUser!:User;
  email!:string;
  firstName!:string;
  userId!:number;


    constructor(private orderService:OrderService,private route:ActivatedRoute,private checkoutService:CheckoutService,private router:Router) {
    }

   ngOnInit(): void {
      this.fetchData();
   }

   fetchData(){
    const user =  sessionStorage.getItem('loggedInUser');
    if(user){
      const person =JSON.parse(user);
      this.firstName = person.given_name ??'';
      this.email = person.email ??'';


      this.checkoutService.findUserByUserId(this.email).subscribe(

        (data)=>{
          console.log("The data is"+data);
          this.userId = data;
          // @ts-ignore
          const orderId:number = this.route.snapshot.paramMap.get('id');
          this.checkoutService.getOrderById(orderId,this.userId).subscribe((data)=>{
            console.log(data);
            this.order= data;
            this.expiryDate = data.createdDate;
            this.paidDate = data.paidDate;
            this.price = data.price;
            // @ts-ignore
            this.productList = data.orderedList;
            this.cardType = data.cardType;
          })
        }
      )

      // @ts-ignore

      console.log(orderId);

    }



   }


  protected readonly formatDate = formatDate;
    redirectToPage(){
      this.router.navigate(["/displayItems"])
    }

}
