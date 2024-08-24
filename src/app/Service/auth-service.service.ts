import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
declare  var google:any;
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  router = inject(Router)

  constructor(private httpClient:HttpClient) { }

  signOut(){
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/'])
  }

  isAuthenticated():boolean{
    if(sessionStorage.getItem("loggedInUser")){
      return true;
    }else{
      return false;
    }
  }

  googleSignIn(idToken:string):Observable<AuthenticationResponse>{
    console.log(idToken)
    return this.httpClient.post<AuthenticationResponse>("http://localhost:8080/api/Users/user/registerByToken",idToken);

  }
}

interface AuthenticationResponse {
  token: string;
}
