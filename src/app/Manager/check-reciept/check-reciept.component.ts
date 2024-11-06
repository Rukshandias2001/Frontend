import {Component, OnInit} from '@angular/core';
import {OrderedList} from "../../Classes/ordered-list";
import {CheckoutService} from "../../Service/checkout.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../Classes/user";

@Component({
  selector: 'app-check-reciept',
  templateUrl: './check-reciept.component.html',
  styleUrls: ['./check-reciept.component.css']
})
export class CheckRecieptComponent implements  OnInit{
  constructor(private route:ActivatedRoute ,private checkOutService:CheckoutService) {
  }

  ngOnInit(): void {
      this.redirectToPage();
  }
  firstName!: string;
  email!: string;
  paidDate!:Date;
  price!: number;
  cardType !: string;
  productList!: Array<OrderedList>;
  user!:User;


  redirectToPage() {
    let id = this.route.snapshot.paramMap.get('id');
    let number = Number(id);
    this.checkOutService.getOrdersById(number).subscribe(
      (data)=>{

        // @ts-ignore
        this.productList = data.orderedList;
        this.price = data.price
        this.cardType = data.cardType;
        this.paidDate = data.paidDate
      }
    );
    this.checkOutService.getUserByOrderId(number).subscribe(
      (data)=>{
        this.user =data;
        // @ts-ignore
        this.firstName = data.lastname;
      }
    )
  }

}
