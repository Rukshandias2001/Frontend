import {Component, OnInit} from '@angular/core';
import {ProductServiceService} from "../../Service/product-service.service";
import {Product} from "../../Classes/products";
import {CanvasJS, CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {Router} from "@angular/router";

@Component({
  selector: 'app-remain-stock',
  templateUrl: './remain-stock.component.html',
  styleUrls: ['./remain-stock.component.css']
})
export class RemainStockComponent implements  OnInit{
  emptyProducts!:Array<Product>;

  listOfProducts!:Array<Product>;
  chartOptions = {
    title: {
      text: "Angular Column Chart with Index Labels"
    },
    animationEnabled: true,
    axisY: {
      includeZero: true
    },
    data: [{
      type: "column", //change type to bar, line, area, pie, etc
      //indexLabel: "{y}", //Shows y value on all Data Points
      indexLabelFontColor: "#5A5757",
      dataPoints: [
        {x: 10, y: 71},
        {x: 20, y: 55},
        {x: 30, y: 50},
        {x: 40, y: 65},
        {x: 50, y: 71},
        {x: 60, y: 92, indexLabel: "Highest\u2191"},
        {x: 70, y: 68},
        {x: 80, y: 38, indexLabel: "Lowest\u2193"},
        {x: 90, y: 54},
        {x: 100, y: 60}

      ]
    }]
  }

  constructor(public productService:ProductServiceService,private router:Router) {
    }
    ngOnInit(): void {
        this.fetchData()
    }

    fetchData(){
      this.productService.getProductsByProducts().subscribe(
        (data)=>{
          this.listOfProducts = data;
          this.displayGrapgh();
        }
      )
      this.fetchDataForEmptyProduct();


    }
    displayGrapgh(){
      let dataPoints = this.listOfProducts.map(
        (data)=>{
          return {
            x: data.id, // Use 'label' for product names
            y: data.quantity,// Keep 'y' for quantity
            label:data.productName
          }

        }
      )

      this.chartOptions = {
        title: {
          text: "Product Status"
        },
        animationEnabled: true,
        axisY: {
          includeZero: true
        },
        data: [{
          type: "column",
          indexLabelFontColor: "#5A5757",
          dataPoints: dataPoints // Set the dynamically generated dataPoints
        }]
      };

    }

    fetchDataForEmptyProduct(){
        this.productService.emptyStock().subscribe(
          (data)=>{
            this.emptyProducts = data ;
          }
        )
    }

    updatePage(id:number){
      this.router.navigate(['/updateForm/'+id]);

    }


}
