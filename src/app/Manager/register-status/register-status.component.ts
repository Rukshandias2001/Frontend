import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {AuthServiceService} from "../../Service/auth-service.service";

declare var google: any;

@Component({
  selector: 'app-register-status',
  templateUrl: './register-status.component.html',
  styleUrls: ['./register-status.component.css']
})
export class RegisterStatusComponent implements OnInit {
  constructor(private router: Router,private authService:AuthServiceService) { }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '130196933040-61k2u0kdkcgn7qqe191hbemsrq8le897.apps.googleusercontent.com',
      callback: (response: any) => {
        this.handleLogin(response);
      }
    });

    google.accounts.id.renderButton(
      document.getElementById("google-btn"), {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 350
      }
    );
  }

  private decodeToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  handleLogin(response: any) {
    if (response) {
      // Decode the token
      this.authService.googleSignIn(response.credential).subscribe(
        (data)=>{
          console.log(data);
        }
      );
      const payload = this.decodeToken(response.credential);
      console.log(payload)
      // Store in session
      sessionStorage.setItem("loggedInUser", JSON.stringify(payload));

      // window.location.reload();
      // Navigate to home/screen
      this.router.navigate(['account']);
    }
  }
}
