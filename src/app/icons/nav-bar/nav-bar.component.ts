import {Component, HostListener, OnInit} from '@angular/core';
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
  isDropDown: boolean  = false

  constructor(private authService:AuthServiceService){

  }

  ngOnInit(): void {
    this.fetchData();
  }

  ifClicked(){
    this.isDropDown = !this.isDropDown
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

  closeDropdown() {
    this.isDropDown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = (event.target as HTMLElement).closest('.nav-item.dropdown');
    if (!clickedInside) {
      this.closeDropdown();
    }
  }


}
