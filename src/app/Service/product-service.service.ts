import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Product} from "../Classes/products";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private httpClient:HttpClient) { }

  addProductsBYClothing(product:FormData):Observable<object>{
    console.log(product)
     return this.httpClient.post("http://localhost:8080/api/manager/addProducts/byClothing",product);
  }
  addProductsBYElectronics(product:FormData):Observable<object>{
    return this.httpClient.post("http://localhost:8080/api/manager/addProducts/byElectronics",product);
  }

  getProductsByProducts():Observable<Product [] >{
    return  this.httpClient.get<Product[]>(" http://localhost:8080/api/Cart/getProducts");
  }

  getProductsByCategory(category:String):Observable<Product []>{
    return this.httpClient.get<Product[]>(`http://localhost:8080/api/Cart/getProductBYCategory/${category}`);
  }

  getProductsById(id:number):Observable<Product>{
    return this.httpClient.get<Product>(`http://localhost:8080/api/Cart/getProductById/${id}`);
  }

  updateProductByElectronics(product:FormData):Observable<Product>{
    return this.httpClient.patch<Product>("http://localhost:8080/api/manager/updateProductByElectronics",product)
  }

  updateProductByClothing(product:FormData):Observable<Product>{
    return this.httpClient.patch<Product>("http://localhost:8080/api/manager/updateProductByClothings",product)

  }





}