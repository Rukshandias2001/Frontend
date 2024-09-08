import {Injectable, OnInit} from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Country} from "../Classes/country";
import {State} from "../Classes/state";
import {Orders} from "../Classes/orders";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService implements OnInit{


  constructor(private httpClient:HttpClient) {

  }

  ngOnInit(): void {

  }

  placeOrder(order:any):Observable<Orders>{
    // @ts-ignore
    return this.httpClient.post<String>("http://localhost:8080/api/Cart/saveOrder",order);
  }

  fetchCountries():Observable<Country []>{
    return this.httpClient.get<Country[]>('http://localhost:8080/api/Cart/getCountries');
  }

  fetchCities(id:number):Observable<State []>{
      // @ts-ignore
      return  this.httpClient.get<State [] >('http://localhost:8080/api/Cart/getCities/'+id)
  }

  getOrderById(id:number,userId:number):Observable<Orders>{
    return this.httpClient.get<Orders>(`http://localhost:8080/api/Cart/createInvoice/${id}?userId=${userId}`)
  }

  findUserByUserId(email:string):Observable<number>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log(email);
    return this.httpClient.post<number>("http://localhost:8080/api/Users/findByEmail",email,{ headers });
  }

  findOrdersByUserId(id:number):Observable<Array<Orders>>{
    return this.httpClient.get<Array<Orders>>(`http://localhost:8080/api/Cart/getOrdersBYUserId/${id}`);
  }

  findUserByRole(id:number):Observable<Array<String>>{
    return this.httpClient.get<Array<String>>(`http://localhost:8080/api/Users/getRoles/${id}`);
  }


}
