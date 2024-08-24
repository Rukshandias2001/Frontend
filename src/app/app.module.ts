import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddproductsComponent } from './Manager/addproducts/addproducts.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DisplayProductsComponent } from './Manager/display-products/display-products.component';
import { AditionalDetailsOfProductsComponent } from './Manager/aditional-details-of-products/aditional-details-of-products.component';
import { OrderedItemsComponent } from './Manager/ordered-items/ordered-items.component';
import { TotalAmountComponent } from './Manager/total-amount/total-amount.component';
import { UpdateProductComponent } from './Manager/update-product/update-product.component';
import { UpdateFormComponent } from './Manager/update-form/update-form.component';
import { ModalComponent } from './Popups/modal/modal.component';
import { CheckoutFormComponent } from './Manager/checkout-form/checkout-form.component';
import { NavBarComponent } from './icons/nav-bar/nav-bar.component';
import { RegisterStatusComponent } from './Manager/register-status/register-status.component';
import { AccountComponent } from './Customer/account/account.component';
import {AuthGuard} from "./guards/auth.guard";
import { PaymentRecieptComponent } from './Manager/payment-reciept/payment-reciept.component';
import { TopCustomerComponent } from './Manager/top-customer/top-customer.component';

const routes:Routes=[
  {path:"addProduct", component:AddproductsComponent, canActivate:[AuthGuard]},
  {path:"displayItems",   component:DisplayProductsComponent, canActivate:[AuthGuard]},
  {path:"displayItem/:id",component:AditionalDetailsOfProductsComponent,canActivate:[AuthGuard]},
  {path:"orderedItems",component:OrderedItemsComponent, canActivate:[AuthGuard]},
  {path:"updateProduct",component:UpdateProductComponent,canActivate:[AuthGuard]},
  {path:"updateForm/:id",component:UpdateFormComponent,canActivate:[AuthGuard]},
  {path:"checkoutForm",component:CheckoutFormComponent, canActivate:[AuthGuard]},
  {path:"account",component:AccountComponent,canActivate:[AuthGuard]},
  {path:"receipt/:id",component:PaymentRecieptComponent,canActivate:[AuthGuard]},
  {path:"viewBestCustomer",component:TopCustomerComponent,canActivate:[AuthGuard]},
  {path:"", component:RegisterStatusComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    AddproductsComponent,
    DisplayProductsComponent,
    AditionalDetailsOfProductsComponent,
    OrderedItemsComponent,
    TotalAmountComponent,
    UpdateProductComponent,
    UpdateFormComponent,
    ModalComponent,
    CheckoutFormComponent,
    NavBarComponent,
    RegisterStatusComponent,
    AccountComponent,
    PaymentRecieptComponent,
    TopCustomerComponent,


  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    CanvasJSAngularChartsModule
  ],
  providers: [provideToastr()],
  bootstrap: [AppComponent]
})
export class AppModule { }
