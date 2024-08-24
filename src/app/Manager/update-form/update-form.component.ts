import {Component, OnInit} from '@angular/core';
import {Product} from "../../Classes/products";
import {ActivatedRoute} from "@angular/router";
import {ProductServiceService} from "../../Service/product-service.service";
import {Electronics} from "../../Classes/electronics";
import {Clothings} from "../../Classes/clothings";
import {ToastrService} from "ngx-toastr";
import swal from "sweetalert2";

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit{

  productName!: string;
  quantity!: number;
  price!: number;
  description!: string;
  imageUrl!: File;
  categoryId!: number;
  warrenty!: string;
  brand!: string;
  colour!: string;
  size!: string;
  id!:number;
  product!:Product;
  type!:string
  selectedFile: File | null = null;

  display:boolean = false;


  constructor(private route:ActivatedRoute,private productService:ProductServiceService,private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.displayProductDetails();
  }




  submitData() {
    let formData = new FormData();
    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

      formData.append("id",this.id+"");
      formData.append("productName", this.productName);
      formData.append("quantity", this.quantity.toString());
      formData.append("description", this.description);
      formData.append("categoryId", this.categoryId.toString());
      formData.append("type", this.type);
      formData.append("price", this.price.toString());



    if (this.product instanceof Electronics) {
      formData.append("warrenty", this.product.warrenty);
      formData.append("brand", this.product.brand);
      console.log('FormData:', formData);
      this.productService.updateProductByElectronics(formData).subscribe(
        (data) => {
          this.toastr.info("Successfully updated the data");
        },
        (error) => {
          swal.fire({
            title: 'Failed!',
            text: 'Only Admin can Update Products !',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          console.error(error);
        }
      );
    } else if (this.product instanceof Clothings) {
      formData.append("size", this.product.size);
      formData.append("colour", this.product.colour);
      console.log('FormData:', formData);
      this.productService.updateProductByClothing(formData).subscribe(
        (data) => {
          this.toastr.info("Successfully updated the data");

        },
        (error) => {
          swal.fire({
            title: 'Failed!',
            text: 'Only Admin can Update Products !',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          console.error(error);

        }
      );
    }
  }
  onFileSelected(event: any) {
    this.selectedFile=event.target.files[0]
  }

  displayProductDetails(){
    this.id = +this.route.snapshot.paramMap.get("id")!;
    this.productService.getProductsById(this.id).subscribe(

      (data)=>{


        if (data.type === 'Electronics') {
          // @ts-ignore
          data = this.restorePrototype(data, Electronics);
        } else if (data.type === 'Clothings') {
          // @ts-ignore
          data = this.restorePrototype(data, Clothings);
        }
        this.product=data;
        this.productName = data.productName;
        this.quantity = data.quantity;
        this.categoryId = data.categoryId;
        this.description = data.description;
        // @ts-ignore
        this.imageUrl = data.imageUrl;
        this.price = data.price;
        this.type = data.type;
        console.log(data instanceof  Electronics)
        console.log(data instanceof  Clothings)
        if(data instanceof  Electronics){
          this.warrenty = data.warrenty;
          this.brand = data.brand
        }else if(data instanceof  Clothings){
          this.colour = data.colour;
          this.size = data.size;
        }

      }
    );

  }

  restorePrototype<T>(obj: any, prototype: new () => T): T {
    obj.__proto__ = prototype.prototype;
    return obj;
  }

  displayModal(){
    this.display = true;
  }


  protected readonly onsubmit = onsubmit;

  confirmAddingTheProduct(){
    swal.fire({
      title: 'Update Products',
      text: 'Are you sure, you want to Update this Product',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Add Product',
      reverseButtons: true,
      inputAttributes: {
        autocapitalize: 'off'
      },
      customClass: {
        container: 'alert-modal',
      },
    }).then((confirm)=>{
      if(confirm){
        this.submitData();
      }
    })
  }
}
