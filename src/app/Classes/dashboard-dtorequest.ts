export class DashboardDTORequest {
  constructor(
    public  totalQuantity:number,
    public  totalPrice:number,
    public  productName:string,
    public  type:string,
    public  productId:number,
    public  price:number) {
  }
}
