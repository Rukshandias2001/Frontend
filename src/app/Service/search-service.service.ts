import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SearchPayload} from "../Classes/search-payload";
import {Observable} from "rxjs";
import {Product} from "../Classes/products";


@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {

  constructor(private httpClient:HttpClient) { }
  searchLoad(searchPayload:SearchPayload,pageNumber:number,size:number):Observable<Product[]>{
    let params = new HttpParams();
    if(searchPayload)
      if(searchPayload.quantity){
        params = params.set('quantity', searchPayload.quantity);
      }

    if (searchPayload.nameOfProduct) {
      params = params.set('nameOfProduct', searchPayload.nameOfProduct);
    }
    if (searchPayload.searchFrom) {
      params = params.set('searchFrom', searchPayload.searchFrom.toString());
    }
    if (searchPayload.searchTo) {
      params = params.set('searchTo', searchPayload.searchTo.toString());
    }
    if (searchPayload.selectedType) {
      params = params.set('selectedType', searchPayload.selectedType);
    }
    if(searchPayload.productId){
      params = params.set('productId', searchPayload.productId);
    }
   

    return this.httpClient.get<Product[]>("http://localhost:8080/api/searchPayLoad/searchResult",{params})
  }
}
