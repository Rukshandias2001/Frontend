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
  role!:string;

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
    window.location.reload();
  }

  fetchData(){
    const user = sessionStorage.getItem("loggedInUser");
    let item = sessionStorage.getItem("Role");

    if(user){
      const loggedInUser = JSON.parse(user);
      this.profilepic = loggedInUser.picture ?? '';
    }

    if(item){
     this.role= JSON.parse(item);
      console.log(this.role)
    }
  }



}
