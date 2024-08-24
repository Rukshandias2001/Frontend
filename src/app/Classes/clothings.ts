import {Product} from "./products";

export class Clothings extends Product{

   size!:string
   colour!:string

  constructor(
    id:number,
    productName:string,
    quantity:number,
    price:number,
    imageUrl:string,
    description:string,
    categoryId:number,
    type:string,
    size:string,
    colour:string

  ) {
    super(id, productName, quantity, price, imageUrl, description, categoryId, type);
  }


}
