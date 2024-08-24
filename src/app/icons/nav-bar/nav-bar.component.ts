import {Component, OnInit} from '@angular/core';
import {AuthServiceService} from "../../Service/auth-service.service";

// @ts-ignore
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent  implements OnInit{
  profilepic!:string;

  constructor(private authService:AuthServiceService){

  }

  ngOnInit(): void {
    this.fetchData();
  }

  isAuthenticated(){
    return this.authService.isAuthenticated();
  }

  signOut(){
    this.authService.signOut();
    localStorage.removeItem("listOfItems");
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.clear();
  }

  fetchData(){
    const user = sessionStorage.getItem("loggedInUser");
    if(user){
      const loggedInUser = JSON.parse(user);
      this.profilepic = loggedInUser.picture ?? '';
    }
  }



}
