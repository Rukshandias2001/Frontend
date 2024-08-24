import {Component, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {Product} from "../../Classes/products";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {CartServiceService} from "../../Service/cart-service.service";
import {SelectedItemServiceService} from "../../Service/selected-item-service.service";
import {SelectedItems} from "../../Classes/selected-items";
import {OrderService} from "../../Service/order.service";
import {User} from "../../Classes/user";
import Swal from "sweetalert2";

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent implements OnInit{
    listOfProducts!:Array<Product>;
    products!:Product

   numberOfItems: number=0;
    email!:string;
    tempUser!:User;

    constructor(private productService:ProductServiceService,private router:Router,private cartService:CartServiceService,private selectedItemService:SelectedItemServiceService,private orderItemsService:OrderService) {
      const loggedInUser = sessionStorage.getItem('loggedInUser');

      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        this.email = user.email ?? '';
        this.tempUser = user;

      }


    }

    ngOnInit(): void {
      this.displayShoppingCart();
      this.cartService.totalQuantity.subscribe(
        (data)=>{
          this.numberOfItems =  data;
        }
      );
      this.calculateTotals();
    }

    displayShoppingCart(){
        this.productService.getProductsByProducts().subscribe(
          (data) => {
            this.listOfProducts = data

          }
        )
    }


  showRelevantItem(category: string) {
      this.productService.getProductsByCategory(category).subscribe(
        (data)=>{
          this.listOfProducts = data
        }
      )
  }

  displayDetailsOfProduct(id:number) {
        this.router.navigate(["displayItem/" + id])
  }

  addToCart(product:Product){
      let item = new SelectedItems(0,product.id,product.productName,product.imageUrl,product.type,product.price,1,product.description,product.categoryId,this.email);
      this.selectedItemService.saveSelectedList(item).subscribe(
        (data)=>{
          if(data){
            this.calculateTotals();
          }
        }
      );
    window.location.reload();
  }

  calculateTotals(){
    this.orderItemsService.totalQuantity.subscribe((data)=>{
      this.numberOfItems = data;
    });

  }

  confirmAddingToCart(product:Product){
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Item added to cart ! ",
      showConfirmButton: false,
      timer: 1500
    }).then((confirm)=>{
      if(confirm){
        this.addToCart(product);
      }
    });
  }




}
