import {Component, OnInit} from '@angular/core';
import {Orders} from "../../Classes/orders";
import {OrderService} from "../../Service/order.service";
import {CheckoutService} from "../../Service/checkout.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css']
})
export class ValidatePaymentComponent implements OnInit{
  listOfProducts!:Array<Orders>;
  pages:number =0;
  totalElements:number=0;

  ngOnInit(): void {
      this.searchProduct(0)
  }
  constructor(private checkoutServiceService:CheckoutService,private route:ActivatedRoute,private router:Router) {


  }

  listOfOrders !: Array<Orders>;


  viewOrder(orderId: number) {
    console.log(orderId);
    this.router.navigate([`/confirmPayment`, orderId]); // Corrected path format
  }


  searchProduct(page:number){
    this.checkoutServiceService.getOrders(page,4).subscribe(
      (data)=>{
        console.log(data)
        // @ts-ignore
        this.listOfProducts = data.content;
        console.log(this.listOfProducts)
        // @ts-ignore
        this.pages =data.totalPages;
        // @ts-ignore
        this.totalElements = data.totalElements
      }
    );
  }
}
