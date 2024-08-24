import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SelectedItemServiceService} from "./selected-item-service.service";
import {User} from "../Classes/user";
import {SelectedItems} from "../Classes/selected-items";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity :Subject<number> = new BehaviorSubject<number>(0);
  listOfSelectedItems :Array<SelectedItems> =[];
  private tempUser!:User;
  private email!: string;


  constructor(public selectedItemService:SelectedItemServiceService,private httpClient:HttpClient ) {
    const loggedInUser = sessionStorage.getItem('loggedInUser');


    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.tempUser = user;
      this.email = user.email ?? '';
      this.fetchData(user);
    }

  }


  fetchData(user:User){
    this.selectedItemService.getSelectedList(user).subscribe((data)=>{
        this.listOfSelectedItems = data;
        this.calculateTotals();


    })
  }


  private calculateTotals() {
    let totalQuantity =0;
    this.listOfSelectedItems.map((data)=>{
      totalQuantity= data.quantity+totalQuantity;
    })
    let price =0;
    this.totalQuantity.next(totalQuantity);
    this.listOfSelectedItems.map((data)=>{
      price = (data.price*data.quantity)+price;
    })
    this.totalPrice.next(price);
  }





}
