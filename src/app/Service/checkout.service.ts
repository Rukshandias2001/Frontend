import {Injectable, OnInit} from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
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

  findOrdersByUserId(id:number,page: number, size: number):Observable<Array<Orders>>{
    return this.httpClient.get<any>(`http://localhost:8080/api/Cart/getOrdersBYUserId/${id}?pageNumber=${page}&size=${size}`).pipe(
      map(response => response.content) // Extract the 'content' part of the Page<Product>
    );
  }

  findOrdersByUserIdGetNumber(id:number,page: number, size: number):Observable<any>{
    return this.httpClient.get<any>(`http://localhost:8080/api/Cart/getOrdersBYUserId/${id}?pageNumber=${page}&size=${size}`)
  }

  findUserByRole(id:number):Observable<Array<String>>{
    return this.httpClient.get<Array<String>>(`http://localhost:8080/api/Users/getRoles/${id}`);
  }


}
