import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {CustomerDtoRequest} from "../Classes/customer-dto-request";
import {DashboardDTORequest} from "../Classes/dashboard-dtorequest";

@Injectable({
  providedIn: 'root'
})
export class BestCustomerService {

  constructor(public httpclient:HttpClient) { }

  fetchCustomers():Observable<Array<CustomerDtoRequest>>{
    return this.httpclient.get<Array<CustomerDtoRequest>>("http://localhost:8080/api/manager/getOrdersbyUser")
  }

  fetchDataOfProducts():Observable<Array<DashboardDTORequest>>{
    return this.httpclient.get<Array<DashboardDTORequest>>("http://localhost:8080/api/manager/getProductDetails")

  }

}
