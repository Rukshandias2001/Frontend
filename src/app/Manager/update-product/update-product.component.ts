import {Component, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {Product} from "../../Classes/products";
import {Router} from "@angular/router";
import {Clothings} from "../../Classes/clothings";
import {SearchPayload} from "../../Classes/search-payload";
import {SearchServiceService} from "../../Service/search-service.service";

// @ts-ignore
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements  OnInit{
  listOfProducts:Array<Product>=[]
  listOfArray:Array<String>=[];
  selectedType!:string;
  productId!:number;
  priceRangeFrom!:number;
  priceRangeTo!:number;
  searchPayload!:SearchPayload;
  productName!:string;
  quantity!:number;
  productQuantity:number =-1;
  pages:number =0;
  totalEelements:number=0;
  filterObj ={

  }


  constructor(private productService:ProductServiceService,private router:Router,private searchService:SearchServiceService) {
  }

  ngOnInit(): void {
    this.getAllProducts(0,6);

    this.listOfArray = ['Electronics','Clothings','All']
  }

  displayProducts(){
   this.productService.getProductsByProducts().subscribe((data)=>{
     this.listOfProducts =data;
   });
  }


  update(item: Product) {
    this.router.navigate(['/updateForm/'+item.id]);
  }


  searchProduct(page:number){
    this.validation();
    console.log(this.searchPayload)
    this.searchService.searchLoad(this.searchPayload,page,6).subscribe(
      (data)=>{
        this.listOfProducts = data;
      }
    );
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

  getAllProducts(page:number,size:number){
    this.productService.getAllProducts(page,6).subscribe(
      (data)=>{
        this.listOfProducts = data;
      }
    )
    this.productService.getPageNumber(0,6).subscribe(
      (data)=>{
        this.pages =data.totalPages;
      }
    )

    this.productService.getPageNumber(0,4).subscribe(
      (data)=>{
        this.pages =data.totalPages;
        this.totalEelements = data.totalElements
      }
    )
  }

}
