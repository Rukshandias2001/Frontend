import {User} from "./user";

export class SelectedItems {

  constructor(
    public id :number,
    public productId:number,
    public productName:string,
    public imageUrl:string,
    public type:string,
    public price:number,
    public quantity:number,
    public description:string,
    public categoryId:number,
    public email:string
   ) {
  }
}
