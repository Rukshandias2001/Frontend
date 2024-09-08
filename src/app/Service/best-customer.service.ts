import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {CustomerDtoRequest} from "../Classes/customer-dto-request";
import {DashboardDTORequest} from "../Classes/dashboard-dtorequest";
import {PieChartDTO} from "../Classes/pie-chart-dto";
import {Orders} from "../Classes/orders";

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
  fetchDataForPieCharts():Observable<Array<PieChartDTO>>{
    return this.httpclient.get<Array<PieChartDTO>>("http://localhost:8080/api/manager/getPercentages")
  }

  fetchlistOfOrders():Observable<Array<Orders>>{
    return this.httpclient.get<Array<Orders>>("http://localhost:8080/api/manager/viewOrder")

  }

  fetchEmailByOrderId(orderId: number): Observable<string> {
    return this.httpclient.get(`http://localhost:8080/api/manager/getEmailByOrderId/${orderId}`, { responseType: 'text' });
  }

  fetchOrdersBYId(orderId:number):Observable<Orders>{
    // @ts-ignore
    return this.httpclient.get("http://localhost:8080/api/Cart/getOrderById/"+orderId)
  }


}
