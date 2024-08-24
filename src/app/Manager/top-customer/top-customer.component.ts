import {Component, OnInit} from '@angular/core';
import {BestCustomerService} from "../../Service/best-customer.service";
import {CustomerDtoRequest} from "../../Classes/customer-dto-request";
import {DashboardDTORequest} from "../../Classes/dashboard-dtorequest";

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-top-customer',
  templateUrl: './top-customer.component.html',
  styleUrls: ['./top-customer.component.css']
})
export class TopCustomerComponent implements OnInit{
  listOfCustomers!:Array<CustomerDtoRequest>
  listOfData!: Array<DashboardDTORequest>

  listOfDataQuantity!:[]

  title = 'angular17ssrapp';
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




  constructor(public bestCustomerService:BestCustomerService) {


  }


  ngOnInit() {
      this.fetchData();
  }

  fetchData(){
    this.bestCustomerService.fetchCustomers().subscribe(
      (data)=>{
        this.listOfCustomers = data;
      }
    )
    this.bestCustomerService.fetchDataOfProducts().subscribe(
      (data)=>{
        this.listOfData = data;
        this.displayGraph();

      }
    )
  }


  displayGraph(){
    let dataPoints = this.listOfData.map((data) => {
      return {
        x: data.productId, // Use 'label' for product names
        y: data.totalQuantity,// Keep 'y' for quantity
        label:data.productName

      };
    });

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









}
