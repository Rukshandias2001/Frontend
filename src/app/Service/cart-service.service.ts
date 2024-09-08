import {Injectable, OnInit} from '@angular/core';
import {Product} from "../Classes/products";
import {BehaviorSubject, Subject} from "rxjs";
import {ProductServiceService} from "./product-service.service";
import {SelectedItemServiceService} from "./selected-item-service.service";
import {SelectedItems} from "../Classes/selected-items";
import {User} from "../Classes/user";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {formatDate} from "@angular/common";


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class CartServiceService  implements  OnInit{
  email!:string
  listOfProducts:Array<Product> = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);
  getAllProducts:Array<Product> =[];
  selectedItems:Array<SelectedItems> =[];
  quantity:number = 0;
  loginUser!:User;
  userName!: string;
  userProfileImage!: string;
  lastName!: string;
  getSelectedItems:Array<SelectedItems> =[];


  constructor(private productService:ProductServiceService,private selectedItemService:SelectedItemServiceService) {
    this.fetchDataFromTheOriganal()
    this.calculateTotals();
    this.fetchTheDataFromTheBackend();

  }

  ngOnInit(): void {


  }

  storeCartDate(product:Product){
    let if_item_includes = this.listOfProducts.find(item=>item.id==product.id)

    if(if_item_includes){
      if_item_includes.quantity += 1;
      if_item_includes.price =if_item_includes.price +product.price;

    }else{
      let tempProduct = product;
      tempProduct.quantity = 1;
      tempProduct.price = product.price;
      this.listOfProducts.push(tempProduct);

    }
    this.calculateTotals();
  }

  calculateTotals(){
    let totalTempPrice =0;
    let tempQuantity =0;
    for (let i =0;i<this.listOfProducts.length;i++){
      totalTempPrice=this.listOfProducts[i].price+totalTempPrice;
      tempQuantity=this.listOfProducts[i].quantity+tempQuantity;
    }
    this.totalPrice.next(totalTempPrice);
    this.totalQuantity.next(tempQuantity);

    this.persistCartItem();
    this.showTotals(totalTempPrice,tempQuantity)
  }

  persistCartItem(){
    this.convertToListOfSelectedItems();
  }

  showTotals(totalTempPrice:number,tempQuantity:number){
    for(let i =0;i<this.listOfProducts.length;i++){
      const quantity = this.listOfProducts[i].quantity ?? 0;
      const unitPrice = this.listOfProducts[i].price ?? 0;
      const subTotalPrice = quantity * unitPrice;

      console.log(`name: ${this.listOfProducts[i].productName}, quantity=${quantity}, unitPrice=${unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`Total Price: ${totalTempPrice.toFixed(2)}, Total Quantity: ${tempQuantity}`);
    console.log('---------');

  }

  decrementItem(product:Product){
    let products =  this.listOfProducts.find((data)=> data.id==product.id);
    let originalProduct = this.getAllProducts.find((data)=>data.id==product.id);

    let findIndex =  this.listOfProducts.findIndex((data)=> data.id ==product.id)
    console.log(findIndex)
    if(products && originalProduct ){
      if(products.quantity>0){
        products.price = products.price- originalProduct.price
        products.quantity--;
        this.listOfProducts[findIndex]=products;

      }
      if(products.quantity==0){
        this.removeItem(product.id)
      }
      this.persistCartItem()
    }

  }

  removeItem(id:number){


    this.selectedItemService.deleteSelectedItem(id).subscribe(
      (data)=>{
        console.log(data);
      }
    )

    this.persistCartItem()

  }

  fetchDataFromTheOriganal(){
    this.productService.getProductsByProducts().subscribe(
      (data)=>{
        this.getAllProducts = data;
        console.log(this.getAllProducts)
      }
    )
  }

  convertToListOfSelectedItems() {
    const user = sessionStorage.getItem("loggedInUser");
    const role = sessionStorage.getItem("Role")

    if (user) {
      if(role){
        let tempUser = JSON.parse(user);
        this.userName = tempUser.given_name ?? '';

        let user_role = JSON.parse(role);
        this.userProfileImage = tempUser.picture ?? '';
        this.email = tempUser.email ?? '';
        this.lastName = tempUser.family_name ?? '';
        let createUser = new User(this.userName,this.lastName,"",this.email,"male",user_role );
        console.log(createUser)
        this.listOfProducts.map((data) => {
          console.log(new SelectedItems(1,data.id, data.productName, data.imageUrl, data.type, data.price, data.quantity, data.description, data.categoryId,  this.email))
          // @ts-ignore
          this.selectedItems.push(new SelectedItems(1,data.id, data.productName, data.imageUrl, data.type, data.price, data.quantity, data.description, data.categoryId, this.email))

        })
        if (this.selectedItems && this.selectedItems.length > 0) {
          this.selectedItems.find((data) => {
            let formData = new FormData();
            console.log(data);
            this.selectedItemService.saveSelectedList(data).subscribe((data) => {

            })
          });
        }
      }
    }
  }

  fetchTheDataFromTheBackend(){
    const user = sessionStorage.getItem("loggedInUser");
    const role = sessionStorage.getItem("Role")
    console.log(user)
    if (user) {
      let tempUser = JSON.parse(user);
      // @ts-ignore
      let userRole = JSON.parse(role);
      this.userName = tempUser.given_name ?? '';
      this.userProfileImage = tempUser.picture ?? '';
      this.email = tempUser.email ?? '';
      this.lastName = tempUser.family_name ?? '';

      let createUser = new User(this.userName, this.lastName, "", this.email, "male",userRole);
      this.selectedItemService.getSelectedList(createUser).subscribe((data)=>{
        this.getSelectedItems = data;
        this.convertSelectedItemsToProductList(this.getSelectedItems);
      })


    }



  }

  convertSelectedItemsToProductList(listOfSelectedItems: Array<SelectedItems>) {
    listOfSelectedItems.map((data)=>{
      this.listOfProducts.push(new Product(data.productId,data.productName,data.quantity,data.price,data.imageUrl,data.description,data.categoryId,data.type));
    })

  }







}
