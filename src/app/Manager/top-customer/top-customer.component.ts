import {Component, OnInit} from '@angular/core';
import {BestCustomerService} from "../../Service/best-customer.service";
import {CustomerDtoRequest} from "../../Classes/customer-dto-request";
import {DashboardDTORequest} from "../../Classes/dashboard-dtorequest";

import {CanvasJS, CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {PieChartDTO} from "../../Classes/pie-chart-dto";
import {Orders} from "../../Classes/orders";
import {Router} from "@angular/router";
import {catchError, forkJoin, map, of} from "rxjs";
import {keyframes} from "@angular/animations";

@Component({
  selector: 'app-top-customer',
  templateUrl: './top-customer.component.html',
  styleUrls: ['./top-customer.component.css']
})
export class TopCustomerComponent implements OnInit{
  listOfCustomers!:Array<CustomerDtoRequest>
  listOfData!: Array<DashboardDTORequest>
  pieChartDatePoints!:Array<PieChartDTO>
  listOfOrders!:Array<Orders>;
  email!:String;

  // @ts-ignore
  monthlyIncome!: Map<{[key:string]:number}> = new Map();
  // @ts-ignore
  monthlyClothingIncome!: Map<{[key:string]:number}> = new Map();

  // @ts-ignore
  monthlyElectronicsIncome!: Map<{[key:string]:number}> = new Map();



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



  chartOptions2: any = {};
  listOfOrdersWithEmails: Array<{ orderId: number, email: string }> = [];
  chartOptions3:any ={};



  constructor(public bestCustomerService:BestCustomerService,private router:Router) {


  }


  ngOnInit() {
      this.fetchData();
      this.fetchListOfOrders();
      this.displayLineChart();
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
    this.bestCustomerService.fetchDataForPieCharts().subscribe(
      (data)=>{
        this.pieChartDatePoints = data;
        console.log(data)
        this.displayPieChart();
      }

    )
  }

  displayLineChart(){
    let dataPoints1: { label: string, y: number }[] = [];
    let dataPoints2: { label: string, y: number }[] = [];
    let dataPoints3: { label: string, y: number }[] = [];
    this.bestCustomerService.fetchMonthlyIncomeOfElectronicAndClothing().subscribe((data)=>{
      this.monthlyIncome = data;
      console.log(data);
      // If the data is an object, iterate using Object.entries()
      Object.entries(this.monthlyIncome).forEach(([key, value]) => {
        // Here key is the month, and value is the income
        dataPoints1.push({ label: key, y: Number(value) });
      });

      console.log(dataPoints1);
    })
    this.bestCustomerService.fetchMonthlyIncomeOfClothing().subscribe((data)=>{
      this.monthlyClothingIncome = data;
      Object.entries(this.monthlyClothingIncome).forEach(([key, value])=>{
        dataPoints2.push({label:key,y:Number(value)})
      })
    })

    this.bestCustomerService.fetchMonthlyIncomeOfElectronics().subscribe((data)=>{
      this.monthlyElectronicsIncome = data;
      Object.entries(this.monthlyElectronicsIncome).forEach(([key, value])=>{
        dataPoints3.push({label:key,y:Number(value)})
      })
    })




    this.chartOptions3 = {
      animationEnabled: true,
      title: {
        text: "Monthly Income"
      },
      axisX: {
        title: "Months"
      },
      axisY: {
        title: "Income (USD)"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [{
        type: "spline",
        showInLegend: true,
        name: "Income",
        dataPoints: dataPoints1  // Use the generated dataPoints1 here
      },
        {
          type: "spline",
          showInLegend: true,
          name: "Clothing",
          dataPoints: dataPoints2  // Just using dataPoints1 for Los Angeles as well
        },
        {
          type: "spline",
          showInLegend: true,
          name: "Electronic",
          dataPoints: dataPoints3  // Just using dataPoints1 for Seattle as well
        }]
    };

    // Render the chart
    // Assuming you are using CanvasJS or any other charting library
    let chart = new CanvasJS.Chart("chartContainer", this.chartOptions3);
    chart.render();

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

  displayPieChart(){

   let pieChartPoints = this.pieChartDatePoints.map((data)=>{
     return {
       name:data.type,
       y:data.percentageOfPoints

     }
   })


    this.chartOptions2 = {
      animationEnabled: true,
      theme: "dark2",
      exportEnabled: true,
      title: {
        text: "Type of Sales Percentage"
      },
      subtitles: [{
        text: "Median hours/week"
      }],
      data: [{
        type: "pie", // This is a pie chart
        indexLabel: "{name}: {y}%", // Shows label and value on the pie slices
        dataPoints: pieChartPoints // Start with an empty array, this will be populated dynamically
      }]
    };


  }

  fetchListOfOrders(){
    this.bestCustomerService.fetchlistOfOrders().subscribe((orders) => {
      const emailRequests = orders.map((order) => {
        return this.bestCustomerService.fetchEmailByOrderId(order.orderId).pipe(
          map((email) => ({ orderId: order.orderId, email })),

          catchError(() => of({ orderId: order.orderId, email: 'No email found' })) // Handle error
        );
      });


      forkJoin(emailRequests).subscribe((orderWithEmails) => {
        // @ts-ignore
        this.listOfOrdersWithEmails = orderWithEmails;
        console.log(orderWithEmails)

      });
    });

  }




  viewOrder(orderId: number) {
    console.log(orderId)
    this.router.navigate(['viewReceipt/'+orderId])
  }



}
