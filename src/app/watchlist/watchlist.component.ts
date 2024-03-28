import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent {
  stocksInWatchlist:string[]=[];
  // stocksInWatchlist:{ticker:string,data:any}[]=[];
  dataOfStocksInWatchlist:{ticker:string,data:any}[]=[];

  stockData:any;
  isLoading:boolean=false;

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
    this.getStock();
    // this.getStockDetails();
    setTimeout(() => {
      this.getStockDetails();
    }, 1000);
  }
  getStock() {
    this.isLoading=true;
    this.http.get('http://localhost:3000/watchlist/getStock').subscribe({
      next: (response: any) => {
        response.forEach((element: { ticker: string }) => {
          if(!this.stocksInWatchlist.includes(element.ticker))
          {
            this.stocksInWatchlist.push(element.ticker);
          }
        });
        console.log("Stocks in watchList",this.stocksInWatchlist);
      }
    })
  }

  getStockDetails(){
    
    for (let i = 0; i < this.stocksInWatchlist.length; i++) {
      const stock = this.stocksInWatchlist[i];

      this.http.get(`http://localhost:3000/search/quote?ticker=${stock}`).subscribe({
        next: (response) => {
          // console.log(response);
          
          this.dataOfStocksInWatchlist.push({ticker:stock,data:response});
          // this.dataOfStocksInWatchlist.data=response;

        },
        error: (error) => {
          console.error('Error:', error);
        }
      })
      
    }
    console.log(this.dataOfStocksInWatchlist)
    this.isLoading=false;
  }

  deleteStock(value:string){
    this.http.delete(`http://localhost:3000/watchlist/deleteStock?ticker=${value}`).subscribe({
      next: (response: any) => {
        this.dataOfStocksInWatchlist = this.dataOfStocksInWatchlist.filter(stock=>stock.ticker!==value);
        console.log(response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
    // this.isLoading=true;
    // this.isLoading=false;
  }


}
