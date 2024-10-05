import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BestCustomerService} from "../../Service/best-customer.service";
import {Orders} from "../../Classes/orders";
import {OrderedList} from "../../Classes/ordered-list";

@Component({
  selector: 'app-view-reciept',
  templateUrl: './view-reciept.component.html',
  styleUrls: ['./view-reciept.component.css']
})
export class ViewRecieptComponent implements  OnInit{
  orders!:Orders;
  productList!:Array<OrderedList>;
  // @ts-ignore
  price: number;
  // @ts-ignore
  paidDate: Date;
  expiryDate: Date | undefined;
  // @ts-ignore
  order: Orders;
  constructor(private router:ActivatedRoute,private dashBoardService:BestCustomerService,public route:Router) {
  }

  ngOnInit(): void {
        this.fetchData();
    }

  fetchData(){
    let id = this.router.snapshot.paramMap.get("id");
    if(id){
      // @ts-ignore
      this.dashBoardService.fetchOrdersBYId(id).subscribe(
        (data)=>{
          this.order= data;
          this.expiryDate = data.createdDate;
          this.paidDate = data.paidDate;
          this.price = data.price;

          // @ts-ignore
          this.productList = data.orderedList;


        }

      )
    }

  }

  redirectToPage() {
    this.route.navigate(["/viewBestCustomer"])
  }
}
