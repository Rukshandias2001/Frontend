export class OrderedList {



  constructor(
    public id:number,
    public productName:string,
    public quantity:number,
    public price:number,
    public imageUrl:string,
    public description:string,
    public categoryId:number,
    public type:string
  ) {
  }

}
