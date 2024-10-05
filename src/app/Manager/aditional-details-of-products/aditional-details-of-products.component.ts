import {Component, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../Classes/products";
import {Electronics} from "../../Classes/electronics";
import {Clothings} from "../../Classes/clothings";
import {lastValueFrom} from "rxjs";
import {compareSegments} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker";
import {SelectedItems} from "../../Classes/selected-items";
import {SelectedItemServiceService} from "../../Service/selected-item-service.service";
import Swal from "sweetalert2";
import swal from "sweetalert2";

@Component({
  selector: 'app-aditional-details-of-products',
  templateUrl: './aditional-details-of-products.component.html',
  styleUrls: ['./aditional-details-of-products.component.css']
})
export class AditionalDetailsOfProductsComponent implements OnInit{
  product!:Product;
  uniqueItem1!:string;
  uniqueItem2!:string;
  quantity:number=0;
  selectedQuantity: any;
  email!:string;
  constructor(private productService:ProductServiceService,private route:ActivatedRoute,private selectedItemService:SelectedItemServiceService) {

  }

  ngOnInit(): void {
       this.viewAdditionalDetails()
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.email = user.email ?? '';


    }

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


  addToCart(id:number,product:Product) {
    console.log(product);
    console.log(this.quantity)
    if(this.quantity>0){
      let item = new SelectedItems(0,product.id,product.productName,product.imageUrl,product.type,product.price,this.quantity,product.description,product.categoryId,this.email);
      this.selectedItemService.addSeveralItemsByOnce(item).subscribe(
        (data)=>{
          if(data){
            this.confirmAddingToCart()
          }

        },
        (error) => {

          console.error('Error saving order', error);
          this.showInvalidMessage('Error saving order');

          // handle error response
        }
      )


    }else{
      this.showInvalidMessage("Enter a valid Quantity!")
    }


  }

  confirmAddingToCart(){
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Item added to cart ! ",
      showConfirmButton: false,
      timer: 1500
    })
  }


  private showInvalidMessage(tittle:string) {
    swal.fire({
      title: 'Failed!',
      text: tittle,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}
