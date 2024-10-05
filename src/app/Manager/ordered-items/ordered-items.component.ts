import {Component, OnInit} from '@angular/core';
import {Product} from "../../Classes/products";
import {CartServiceService} from "../../Service/cart-service.service";
import {ProductServiceService} from "../../Service/product-service.service";
import {Route, Router} from "@angular/router";
import {SelectedItems} from "../../Classes/selected-items";
import {SelectedItemServiceService} from "../../Service/selected-item-service.service";
import {using} from "rxjs";
import {User} from "../../Classes/user";
import swal from "sweetalert2";
import {OrderService} from "../../Service/order.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ordered-items',
  templateUrl: './ordered-items.component.html',
  styleUrls: ['./ordered-items.component.css']
})
export class OrderedItemsComponent implements OnInit{

  selectedItems:Array<SelectedItems>=[];
  email!:string;
  tempUser!:User;
  price:number =0;
  quantity:number =0;
  listOfProducts!:Array<Product>;
  sortOption: any;
  discountCode: any;
  ngOnInit(): void {
    this.fetchTheLoad()
  }

  fetchTheLoad(){
    this.productService.getProductsByProducts().subscribe(
      (data)=>{
        this.listOfProducts = data;
      }
    )
  }
  constructor(private selectItemService:SelectedItemServiceService,private router:Router,public orderService:OrderService,public productService:ProductServiceService) {
    const loggedInUser = sessionStorage.getItem('loggedInUser');


    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.tempUser = user;
      this.email = user.email ?? '';
      this.fetchData();
    }

  }

  calculateTotals(){
    this.orderService.totalPrice.subscribe((data)=>{
        this.price = data;
      })
    this.orderService.totalQuantity.subscribe((data)=>{
      this.quantity = data;
    })


  }
  deleteItem(){
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Item deleted successfully ! ",
      showConfirmButton: false,
      timer: 1500
    })
  }

  fetchData(){
      this.selectItemService.getSelectedList(this.tempUser).subscribe(
        (data)=>{
          this.selectedItems = data;

        }
      )


  }

  checkoutForm() {
    this.router.navigate(["checkoutForm"])
  }


  remove(item: SelectedItems) {
    item.quantity--;
    let tempItem = new SelectedItems(item.id,item.productId,item.productName,item.imageUrl,item.type,item.price,-1,item.description,item.categoryId,item.email);

    if(item.quantity>0){
      this.selectItemService.saveSelectedList(tempItem).subscribe(
        (data)=>{
          if(data){
            this.calculateTotals();

          }
        }
      )
    }else {
      this.confirmDeletingTheProduct(item.id)
    }

  }

  addItem(item: SelectedItems){
    item.quantity++;
    let tempItem = new SelectedItems(item.id,item.productId,item.productName,item.imageUrl,item.type,item.price,1,item.description,item.categoryId,item.email);
    this.fetchTheLoad();
     let product = this.listOfProducts.find((data)=>{
       return data.imageUrl === item.imageUrl
     })
    // @ts-ignore
    console.log(product?.quantity>item.quantity)
    console.log(product?.quantity)
    // @ts-ignore
    if(product?.quantity>=item.quantity){
      this.selectItemService.saveSelectedList(tempItem).subscribe(
        (data)=>{
          if(data){
            this.calculateTotals();

          }
        }
      )

    }else{
      swal.fire({
        title: 'Count exceeded !',
        text: 'Cannot add more product You have reached the count',
        icon: 'warning',

        confirmButtonColor: '#3085d6',

        confirmButtonText: 'OK'



      }).then((confirm)=>{
        if(confirm.isConfirmed){
          window.location.reload();
        }
      })

    }


  }


  confirmDeletingTheProduct(id:number){
    swal.fire({
      title: 'Delete The Product !',
      text: 'Are you sure, you want to Delete this Product',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete product',
      reverseButtons: true,
      inputAttributes: {
        autocapitalize: 'off'
      },
      customClass: {
        container: 'alert-modal',
      },
    }).then((confirm)=>{
      if(confirm.isConfirmed){
        this.removeItem(id);
      }
    })
  }

  removeItem(id: number) {
    this.selectedItems = this.selectedItems.filter((data)=>data.id!=id);
      this.selectItemService.deleteSelectedItem(id).subscribe(
        (data)=>{
          console.log(data);

          this.deleteItem();
          this.calculateTotals();
        },
        (error) => {
          swal.fire({
            title: 'Failed!',
            text: 'There was an error deleting the product !',
            icon: 'warning',
            confirmButtonText: 'OK'
          })})
  }

  sortProducts() {

  }

  applyDiscount() {

  }
}
