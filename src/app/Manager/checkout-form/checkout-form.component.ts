import {Component, OnInit} from '@angular/core';
import {CartServiceService} from "../../Service/cart-service.service";
import {CheckoutService} from "../../Service/checkout.service";
import {Country} from "../../Classes/country";
import {State} from "../../Classes/state";
import swal from "sweetalert2";
import {CreditCards} from "../../Classes/credit-cards";
import {Product} from "../../Classes/products";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderedList} from "../../Classes/ordered-list";
import {OrderService} from "../../Service/order.service";

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements  OnInit{
    price!:number
    countryList:Country[]=[];
    cityList:State[]=[];
    firstName!:string;
    lastName!:string;
    email!:string;
    creditCardNumber!:string;
    nameOfCard!:string;
    date !: Date;
    listOfCards = ["MasterCard","VisaCard"];
    expiryData!:Date;
    cvv!:string
    formData!:FormData;
    productList!:Array<Product>;
    listOfProductIds!:Array<number>;
    orderList:Array<OrderedList> = new Array<OrderedList>();



    constructor(private cartService:CartServiceService,private checkoutService:CheckoutService,private route:ActivatedRoute,private router:Router,private orderItemService:OrderService) {

    }
    ngOnInit(): void {
        this.getTheCountries();
        this.getUserDetails();
        this.orderItemService.totalPrice.subscribe((data)=>{
          this.price = data;
        })

    }

    getUserDetails(){
      const loggedInUser = sessionStorage.getItem('loggedInUser');
      if(loggedInUser){
        const user = JSON.parse(loggedInUser)
        this.firstName =  user.given_name ?? '';
        this.lastName = user.family_name ?? '';
        this.email = user.email
      }

    }


   getTheCountries(){
      this.checkoutService.fetchCountries().subscribe(
        (data)=>{
          this.countryList=data;
          console.log(data)
        }
      )
   }

   getTheCityList(id:number){
      this.checkoutService.fetchCities(id).subscribe(
        (data)=>{
          this.cityList =data;
          console.log(data);
        }
      );
   }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log(selectElement.options.selectedIndex)
    const countryId = Number(selectElement.options.selectedIndex);
    this.getTheCityList(countryId);
  }


  confirmAddingTheProduct() {
    swal.fire({
      title: 'Proceed Transaction',
      text: 'Are you sure, you want to Purchase these Items !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Purchase Items',
      reverseButtons: true,
      inputAttributes: {
        autocapitalize: 'off'
      },
      customClass: {
        container: 'alert-modal',
      },
    }).then((confirm)=>{
      if(confirm){
        this.purchaseProduct();
      }
    })
  }


  private purchaseProduct() {

    if (!this.creditCardNumber || !this.expiryData || !this.nameOfCard || !this.cvv) {
      this.showInvalidMessage("Please provide correct data ! ");
      return;
    }
    const listOfOrders = this.createOrderList(this.cartService.listOfProducts);


    const orderData = {
      id: 1, // or another identifier if needed
      userName: this.firstName,
      lastName: this.lastName,
      date: this.date,
      expiryDate: this.expiryData,
      nameOfCard: this.nameOfCard,
      creditCardNumber: this.creditCardNumber,
      email: this.email,
      cardType: this.nameOfCard,
      cvv: this.cvv,
      price: this.price,
      listOfProducts: this.cartService.listOfProducts,
      orderList:listOfOrders,
    };



    console.log(orderData);
    this.checkoutService.placeOrder(orderData).subscribe(

      (data) => {
        swal.fire({
          position: "center",
          icon: "success",
          title: "Successfully purchased the items !",
          showConfirmButton: false,
          timer: 3500
        });
        console.log(data.orderId);
        this.router.navigate(['receipt/'+data.orderId])
        // handle success response
      },
      (error) => {

        console.error('Error saving order', error);
        this.showInvalidMessage('Error saving order');

        // handle error response
      }
    );
  }

  createOrderList(product:Array<Product>):Array<OrderedList>{
    console.log(product);

    // Initialize a local array for the new ordered list items
    const newOrderList: Array<OrderedList> = [];

    for (let i = 0; i < product.length; i++) {

      newOrderList.push(new OrderedList(
        product[i].id,
        product[i].productName,
        product[i].quantity,
        product[i].price, // @ts-ignore
        product[i].imageUrl,
        product[i].description,
        product[i].categoryId,
        product[i].type,
        "pending"
      ));
    }

    // Assign the local array to this.orderList
    this.orderList = newOrderList;

    console.log(this.orderList);
    return this.orderList;
  }

  selectCardType(type:Event){
      const target = type.target as HTMLSelectElement;
      this.nameOfCard =target.value;


  }


  private showInvalidMessage(tittle:string) {
    swal.fire({
      title: 'Failed!',
      text: tittle,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }


}
