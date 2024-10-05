import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SelectedItems} from "../Classes/selected-items";
import {User} from "../Classes/user";

@Injectable({
  providedIn: 'root'
})
export class SelectedItemServiceService {

  constructor(private httpClient:HttpClient) {

  }

  saveSelectedList(selectedItem:SelectedItems):Observable<SelectedItems>{
    console.log(selectedItem)
    return this.httpClient.post<SelectedItems>(" http://localhost:8080/api/Cart/selectedList",selectedItem);
  }

  getSelectedList(user: User): Observable<Array<SelectedItems>> {

    // @ts-ignore
    const params = new HttpParams().set('name', user.username).set('email', user.email); // Assuming User has these fields
    return this.httpClient.get<Array<SelectedItems>>("http://localhost:8080/api/Cart/getSelectedList", { params });
  }

  deleteSelectedItem(id:number):Observable<SelectedItems>{
    return this.httpClient.delete<SelectedItems>(`http://localhost:8080/api/Cart/deleteSelectedList/${id}`)
  }

  addSeveralItemsByOnce(selectedItems:SelectedItems):Observable<SelectedItems>{
    return this.httpClient.post<SelectedItems>(`http://localhost:8080/api/Cart/addFavouritesByQuantity`,selectedItems)

  }




}
