import {Component, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../Classes/products";
import {Electronics} from "../../Classes/electronics";
import {Clothings} from "../../Classes/clothings";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-aditional-details-of-products',
  templateUrl: './aditional-details-of-products.component.html',
  styleUrls: ['./aditional-details-of-products.component.css']
})
export class AditionalDetailsOfProductsComponent implements OnInit{
  product!:Product;
  uniqueItem1!:string;
  uniqueItem2!:string;
  constructor(private productService:ProductServiceService,private route:ActivatedRoute) {

  }

  ngOnInit(): void {
       this.viewAdditionalDetails()
    }

  async viewAdditionalDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    try {
      let data = await lastValueFrom(this.productService.getProductsById(theProductId));

      if (data.type === 'Electronics') {
        // @ts-ignore
        data = this.restorePrototype(data, Electronics);
      } else if (data.type === 'Clothings') {
        // @ts-ignore
        data = this.restorePrototype(data, Clothings);
      }
      console.log(data instanceof Electronics); // Should be true if Electronics
      console.log(data instanceof Clothings); //
      this.product = data;
      if(this.product instanceof  Electronics){
        this.uniqueItem1 = " Warranty  :  "  + this.product.warrenty;
        this.uniqueItem2 = " Brand      :  "+  this.product.brand;
      }else if(this.product instanceof Clothings){
        this.uniqueItem1 = "Colour   :  "+ this.product.colour;
        this.uniqueItem2 =" Size     : " + this.product.size;
      }

      console.log(this.product)

    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }

  restorePrototype<T>(obj: any, prototype: new () => T): T {
    obj.__proto__ = prototype.prototype;
    return obj;
  }



}
