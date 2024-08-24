import {Data} from "@angular/router";
import {User} from "./user";
import {Product} from "./products";
import {CreditCards} from "./credit-cards";
import {OrderedList} from "./ordered-list";

export class Orders {

  constructor(public orderId:number,public date:Date,public user:User,public price:number,public product:Product,public creditCards:CreditCards,public paidDate:Date,public createdDate:Date,public cardType:string,public orderedList:OrderedList) {

  }


}
