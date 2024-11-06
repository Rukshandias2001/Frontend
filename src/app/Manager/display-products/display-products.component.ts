import {Component, HostListener, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {Product} from "../../Classes/products";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {CartServiceService} from "../../Service/cart-service.service";
import {SelectedItemServiceService} from "../../Service/selected-item-service.service";
import {SelectedItems} from "../../Classes/selected-items";
import {OrderService} from "../../Service/order.service";
import {User} from "../../Classes/user";
import Swal from "sweetalert2";
import {SearchPayload} from "../../Classes/search-payload";
import {SearchServiceService} from "../../Service/search-service.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent implements OnInit{
    listOfProducts!:Array<Product>;
    products!:Product
    productId!:number;
    priceRangeFrom!:number;
    priceRangeTo!:number;
    searchPayload!:SearchPayload;
    productName!:string;
    quantity!:number;
    productQuantity:number =-1;
  listOfArray:Array<String>=[];
  selectedType!:string;


    numberOfItems: number=0;
    email!:string;
    tempUser!:User;
    pages:number =0;
    totalEelements:number=0;


    constructor(private productService:ProductServiceService,private router:Router,private cartService:CartServiceService,private selectedItemService:SelectedItemServiceService,private orderItemsService:OrderService,private searchService:SearchServiceService) {
      const loggedInUser = sessionStorage.getItem('loggedInUser');


      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        this.email = user.email ?? '';
        this.tempUser = user;

      }


    }

    ngOnInit(): void {

      this.cartService.totalQuantity.subscribe(
        (data)=>{
          this.numberOfItems =  data;
        }
      );
      this.listOfArray = ['Electronics','Clothings','All']
      this.calculateTotals();
      // this.getAllProducts(0,3);
      this.searchProduct(0);
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

  validation() {
    this.searchPayload = new SearchPayload();

    if(this.productId!=null){
      this.searchPayload.productId=this.productId;

    }
    if(this.priceRangeFrom!=null){
      this.searchPayload.searchFrom = this.priceRangeFrom;
    }
    if(this.priceRangeTo!=null){
      this.searchPayload.searchTo = this.priceRangeTo;
    }
    if(this.productName!=null){
      this.searchPayload.nameOfProduct = this.productName;
    }
    if(this.selectedType != null && this.selectedType !== 'All'){
      console.log(this.selectedType)
      this.searchPayload.selectedType = this.selectedType;
    }
    if(this.quantity!=null){
      this.searchPayload.quantity = this.quantity;
    }
    if(this.productQuantity!=null){
      this.searchPayload.quantity = this.productQuantity;
    }

  }



  searchProduct(page:number){
    this.validation();
    console.log(page)
    console.log(this.searchPayload)
    this.searchService.searchLoad(this.searchPayload,page,4).subscribe(
      (data)=>{
        console.log(data)
        // @ts-ignore
        this.listOfProducts = data.content;
        // @ts-ignore
        this.pages =data.totalPages;
        // @ts-ignore
        this.totalEelements = data.totalElements
      }
    );
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
