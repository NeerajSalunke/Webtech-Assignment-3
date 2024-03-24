import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
// import { DetailsService } from 'src/services/details.service';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts/highstock';
import indicators from 'highcharts/indicators/indicators';
import volumeByPrice from 'highcharts/indicators/volume-by-price';

indicators(Highcharts);
volumeByPrice(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() responseDataProfile: any;
  @Input() responseDataQuote: any;
  @Input() responseDataPeers: any;
  @Input() responseDataSentiments: any;
  @Input() responseDataPolyHour: any;
  @Input() responseDataRecTrends: any;
  @Input() responseDataCompEarn: any;
  @Input() responseDataPolyTwoYr: any;
  @Input() isLoading: boolean = false;
  @Input() searchForm: any;
  @Input() onSubmit: any;
  // @Input() newTicker: any;
  @Input() tickerSymbol!:any;
  symbol!: any;

  // this.displayHourlyStockPrice();

  @Output() peerClicked = new EventEmitter<string>();
  stockPrices: number[] = [];
  xAxisRecTren: string[] = [];
  strongBuyArray: number[] =[];
  buyArray: number[] =[];
  holdArray: number[]=[];
  sellArray:number[]=[];
  strongSellArray:number[]=[];

  periodArr:string[]=[];
  actualArr:number[]=[];
  estimateArr:number[]=[];
  surprisesArr:string[]=[];

  ohlc:any[]=[];
  volume:any[]=[];

  // chart: Highcharts.Chart | undefined;


  // constructor(private detailsService: DetailsService) { }

  ngOnInit(): void {
    // this.stockPrices=[];
    // this.displayRecTren();
    // console.log(typeof this.chartOptions[1].chartConfig);
    // console.log(typeof this.columnChartOptions);
    // this.displayTwoYr();
  }
  


  displayHourlyStockPrice(){
    // console.log(this.responseDataPolyHour);
   
   
    this.responseDataPolyHour.results.forEach((element: { c: number }) => {
      this.stockPrices.push(element.c);
    });
    
    // console.log(this.stockPrices);
  }

  displayRecTren(){
    // this.symbol=this.responseDataRecTrends[0].symbol;
    // console.log(this.symbol);
    this.responseDataRecTrends.forEach((element:{period:string,strongBuy:number, buy:number, hold:number,sell:number, strongSell:number})=>{
      this.xAxisRecTren.push(element.period);
      this.strongBuyArray.push(element.strongBuy);
      this.buyArray.push(element.buy);
      this.holdArray.push(element.hold);
      this.sellArray.push(element.sell);
      this.strongSellArray.push(element.strongSell);
      // console.log(this.xAxisRecTren);
    })
  }

  displayCompEarn(){
    this.responseDataCompEarn.forEach((element:{actual:number, estimate:number, period:string,surprise:string}) => {
      this.periodArr.push(element.period);
      this.actualArr.push(element.actual);
      this.estimateArr.push(element.estimate);
      this.surprisesArr.push(element.surprise);
    });
  }

  displayTwoYr(){
    // this.symbol=this.responseDataPolyTwoYr.ticker;
    
    this.responseDataPolyTwoYr.results.forEach((element:{t:number,o:number,h:number,l:number,c:number,v:number}) => {
      this.ohlc.push([
        element.t,
        element.o,
        element.h,
        element.l,
        element.c,
      ]);
      this.volume.push([
        element.t,
        element.v
      ]);
    });
    // console.log("OHLC:",this.ohlc);
    // console.log(this.volume);
  }

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  lineChart: Highcharts.Options = {
    chart:{
      backgroundColor:'#f5f5f5'
    },
    title:{
      text: "Hourly Price Variation"
    },
    
    xAxis:{
      // type:'datetime'
    },
    yAxis:{
      labels:{
        format:'{value}'
      },
      title:{
        text:''
      },
      opposite:true
    },
    series: [{
      data: this.stockPrices,
      type: 'line'
    }] as Highcharts.SeriesOptionsType[] 
  }; // required
  // chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false


  // columnChartOptions = {
  columnChart: Highcharts.Options = {
    title:{
      text: "Recommendation Trends"
    },
    chart: {
      type: "column",
      backgroundColor:'#f5f5f5'
    },
    
    xAxis:{
      categories: this.xAxisRecTren,
    },
    yAxis:{
      min:0,
      title:{
        text: 'Analysis'
      },
      stackLabels:{
        enabled:true,
      }
    },
    colors: [
      '#166834',
      '#19a34b',
      '#97711e',
      '#be4547',
      '#5e2223',
    ],
    plotOptions : {
      column: {
         dataLabels: {
            enabled: true
         },
      },
      series: {
         stacking: 'normal'
      }
   },
    series: [{
      name: 'Strong Buy',
      data: this.strongBuyArray,
    },{
      name: 'Buy',
      data: this.buyArray,
    },{
      name: 'Hold',
      data: this.holdArray,
    },{
      name: 'Sell',
      data: this.sellArray,
    },{
      name: 'strongSell',
      data:this.strongSellArray,
    }] as Highcharts.SeriesOptionsType[]
  }

  splineChart: Highcharts.Options = {
    title:{
      text: "Historical EPS Surprises"
    },
    chart: {
      type: "spline",
      backgroundColor:'#f5f5f5',
    },
    
    xAxis:{
      categories: this.periodArr
    },
    yAxis:{
      title:{
        text: 'Quaterly EPS'
      },
      stackLabels:{
        enabled:true,
      }
    },
    tooltip:{
      shared:true,
    },
    series: [{
      name: 'Actual',
      data: this.actualArr,
    },{
      name: 'Estimate',
      data: this.estimateArr,
    }] as Highcharts.SeriesOptionsType[]
  }

  volSmaChart: Highcharts.Options = {
    chart:{
      backgroundColor: '#f5f5f5'
    },
    title:{
      text:'Historical'
    },
    subtitle:{
      text:'With SMA and Volume by Price technical indicators'
    },
    rangeSelector: {
      selected: 2
    },
    yAxis:[{
      title:{
        text:'OHLC'
      },
      height:'60%',
      lineWidth:2,
    },{
      title:{
        text:'Volume'
      },
      top:'65%',
      height:'35%',
      offset:0,
      lineWidth:2,
    }],
    series:[{
      type:'candlestick',
      // name:'',
      id:'ticker',
      data:this.ohlc,
      zIndex:2,
    },{
      type:'column',
      name:'volume',
      id:'volume',
      yAxis:1,
      data:this.volume,
    },{
      type:'vbp',
      linkedTo:'ticker',
      zIndex:0,
      params:{
        volumeSeriesID:'volume',
      },
      dataLabels: {
        enabled: false
      },
      zoneLines: {
        enabled: false
      },
    },{
      type:'sma',
      linkedTo:'ticker',
      zIndex:1,
      marker:{
        enabled:false,
      }
    }
    ] as Highcharts.SeriesOptionsType[]
  }

  // chartOptions = [
  //   // {chartConfig: this.lineChartOptions},
  //   // {chartConfig: this.columnChartOptions},
  // ];





  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  timeDiff(timestamp1: number): boolean {
    const date1 = new Date(timestamp1 * 1000);
    const currentDate = new Date();
    // console.log(date1);
    // console.log(currentDate);
    const diff = Math.abs(currentDate.getTime() - date1.getTime());
    if (diff / 1000 > 60) {
      // console.log(diff)
      return false;
    }
    return true;
  }

  searchPeer(peer: string) {
    this.searchForm.controls['ticker'].setValue(peer);
    this.peerClicked.emit(peer);
    // this.onSubmit();
  }

  aggregateMSPR(key: string) {
    let totalMsprPos = 0, totalMspr = 0;
    for (let i = 0; i < this.responseDataSentiments.data.length; i++) {
      let mspr = this.responseDataSentiments.data[i].mspr;
      totalMspr += mspr;
      if (mspr > 0) {
        totalMsprPos += mspr;
      }
    }
    let totalMsprNeg = totalMspr - totalMsprPos;
    // console.log(totalMspr)
    // console.log(totalMsprPos)
    // console.log(totalMsprNeg)
    if (key == "t") return totalMspr.toFixed(2);
    else if (key == "p") return totalMsprPos.toFixed(2);
    return totalMsprNeg.toFixed(2);
  }

  aggregateChange(key: string) {
    let totalChangePos = 0, totalChange = 0;
    for (let i = 0; i < this.responseDataSentiments.data.length; i++) {
      let change = this.responseDataSentiments.data[i].change;
      totalChange += change;
      if (change > 0) {
        totalChangePos += change;
      }
    }
    let totalChangeNeg = totalChange - totalChangePos;
    // console.log(totalMspr)
    // console.log(totalMsprPos)
    // console.log(totalMsprNeg)
    if (key == "t") return totalChange;
    else if (key == "p") return totalChangePos;
    return totalChangeNeg;
  }

  


}
