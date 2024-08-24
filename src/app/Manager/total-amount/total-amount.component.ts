import {Component, OnInit} from '@angular/core';
import {CartServiceService} from "../../Service/cart-service.service";
import {OrderService} from "../../Service/order.service";

@Component({
  selector: 'app-total-amount',
  templateUrl: './total-amount.component.html',
  styleUrls: ['./total-amount.component.css']
})
export class TotalAmountComponent implements  OnInit{
  totalAmount:number =0;

  constructor(private cartService:CartServiceService,private orderItemService:OrderService) {

  }
  ngOnInit(): void {
       this.orderItemService.totalPrice.subscribe(
         (data)=>{
           this.totalAmount = data;
         }
       )
  }



}
