import {Product} from "./products";

export class Electronics extends Product{
   warrenty!:string;
   brand!:string;


  constructor(
    id:number,
    productName:string,
    quantity:number,
    price:number,
    imageUrl:string,
    description:string,
    categoryId:number,
    type:string,
    warrenty:string,
    brand:string
) {
    super(id, productName, quantity, price, imageUrl, description, categoryId, type);

  }


}
