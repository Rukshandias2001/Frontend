import {Component, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {Product} from "../../Classes/products";
import {Router} from "@angular/router";

// @ts-ignore
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements  OnInit{
  listOfProducts:Array<Product>=[]

  constructor(private productService:ProductServiceService,private router:Router) {
  }

  ngOnInit(): void {
    this.displayProducts();
  }

  displayProducts(){
   this.productService.getProductsByProducts().subscribe((data)=>{
     this.listOfProducts =data;
   });
  }


  update(item: Product) {
    this.router.navigate(['/updateForm/'+item.id]);


  }
}
