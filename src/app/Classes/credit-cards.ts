import {Orders} from "./orders";

export class CreditCards {

  constructor(public id:number,public cardNumber:string,public expiryDate:Date,public cvv:string,orders:Array<Orders>){

  }


}
