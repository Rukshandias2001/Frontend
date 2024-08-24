import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from "../../Service/product-service.service";
import { Electronics } from "../../Classes/electronics";
import { Clothings } from "../../Classes/clothings";
import { Product } from "../../Classes/products";
import {ToastrService} from "ngx-toastr";
import swal from "sweetalert2";

@Component({
  selector: 'app-addproducts',
  templateUrl: './addproducts.component.html',
  styleUrls: ['./addproducts.component.css']
})
export class AddproductsComponent implements OnInit {

  id = 0;
  productName!: string;
  quantity!: number;
  price!: number;
  imageUrl!:File;
  description!: string;
  categoryId!: number;
  type!: string;

  warrenty!: string;
  brand!: string;

  size!: string;
  colour!: string;

  product!: Product;
  successMessage!: string;
  selectedFile: File | null = null;


  constructor(private productService: ProductServiceService,private toastr: ToastrService) { }

  ngOnInit(): void { }

  submitData(): void {
    this.validateData();
  }

  onProductTypeChange(type: any): void {
    if (type.target.value == "Electronics") {
      this.categoryId = 1;
      this.type = "Electronics";
      this.product = new Electronics(0, "", 0, 0,"", "", 1, "", "", "");
    } else if (type.target.value == "Clothings") {
      this.product = new Clothings(0, "", 0, 0, "", "", 2, "", "", "");
      this.categoryId = 2;
      this.type = "Clothings";
    }
  }

  validateData(): void {
    if (!this.product) {
      swal.fire({
        title: 'Invalid Data !',
        text: 'Please provide correct data',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const isValid = this.validateCommonFields() && this.validateCategorySpecificFields();

    if (isValid) {
      this.sendData();
    } else {
      console.error('Validation failed');
      swal.fire({
        title: 'Failed!',
        text: 'Please provide correct data',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }


  }

  validateCommonFields(): boolean {
    if (!this.productName || !this.quantity || !this.description || !this.imageUrl || !this.categoryId || !this.type || !this.price) {
      return false;
    }

    this.product.productName = this.productName;
    this.product.quantity = this.quantity;
    this.product.description = this.description;
    // @ts-ignore
    this.product.imageUrl = this.imageUrl;
    this.product.categoryId = this.categoryId;
    this.product.type = this.type;
    this.product.price = this.price;

    return true;
  }

  validateCategorySpecificFields(): boolean {
    if (this.categoryId == 1 && this.product instanceof Electronics) {
      if (!this.brand || !this.warrenty) return false;
      this.product.brand = this.brand;
      this.product.warrenty = this.warrenty;
    } else if (this.categoryId == 2 && this.product instanceof Clothings) {
      if (!this.colour || !this.size) return false;
      this.product.colour = this.colour;
      this.product.size = this.size;
    } else {
      return false;
    }
    return true;
  }

  sendData(): void {
    console.log("Sending data");
    let formData = new FormData();


    if(this.selectedFile){
      if (this.product!=null){
        formData.append("file",this.selectedFile);
        formData.append("productName",this.product.productName);
        formData.append("quantity",this.product.quantity+"");
        formData.append("description",this.product.description);
        formData.append("categoryId",this.product.categoryId+"");
        formData.append("type",this.product.type);
        formData.append("price",this.product.price+"");
        if(this.product instanceof  Clothings){
          formData.append("colour",this.product.colour);
          formData.append("size",this.product.size);

          this.productService.addProductsBYClothing(formData).subscribe(
            (data) => {
              console.log(data);
              this.successMessage = "Product added successfully!";
              swal.fire({
                title: 'Done!',
                text: 'Successfully added the data',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            },
            (error) => {
              swal.fire({
                title: 'Failed!',
                text: 'Only Admin can Add Products !',
                icon: 'warning',
                confirmButtonText: 'OK'
              });

              console.error('Error adding product', error);
            }
          );
        }else if(this.product instanceof  Electronics){
          formData.append("warrenty",this.product.warrenty);
          formData.append("brand",this.product.brand);

          this.productService.addProductsBYElectronics(formData).subscribe(
            (data) => {
              console.log(data);
              this.successMessage = "Product added successfully!";
              swal.fire({
                title: 'Done!',
                text: 'Successfully added the data',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            },
            (error) => {
              swal.fire({
                title: 'Failed!',
                text: 'Only Admin can Add Products !',
                icon: 'warning',
                confirmButtonText: 'OK'
              });
              console.error('Error adding product', error);

            }
          )

        }

      }
    }else{
      swal.fire({
        title: 'Failed!',
        text: 'Please provide correct data',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

  }

  onFileSelected(event: any) {
    this.selectedFile=event.target.files[0]
  }

  confirmAddingTheProduct(){
    swal.fire({
      title: 'Add Products',
      text: 'Are you sure, you want to Add this Product',
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
