import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { DetailsService } from 'src/services/details.service';

import { inject, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  balance: any;
  portfolioList: { ticker: string, name: string, quantity: number,price:string }[] = [];
  quote: any;
  tickerSymbol: any;
  isLoading: boolean = false;
  selectedPortfolio:any;
  quantity:number=0;
  stockBought:boolean=false;

 

  constructor
    (
      private http: HttpClient,
      // private detailsService: DetailsService,
    ) { }

    parseNumber(value:any):number{
      return parseFloat(value)
    }
  ngOnInit(): void {
    this.isLoading = true;
    // this.getQuote();
    this.getBalance();
    this.getPortfolio();
  }
  getBalance() {
    this.http.get('http://localhost:3000/portfolio/getBalance').subscribe({
      next: (response: any) => {
        // console.log(response)
        this.balance = response[0].balance
        // console.log(this.balance)
      }
    })
  }

  

  getPortfolio() {
    this.http.get('http://localhost:3000/portfolio/getPortfolio').subscribe({
      next: (response: any) => {
        console.log(response)
        if(response.length==0)
        {
          this.isLoading=false;
        }
        response.forEach((element: { ticker: string, name: string, quantity: number, price:string }) => {
          this.portfolioList.push({
            ticker: element.ticker,
            name: element.name,
            quantity: element.quantity,
            price:element.price
          })
          this.tickerSymbol = element.ticker;
          this.isLoading = false;

        });
      }
    })

  }

  getQuote() {
    this.http.get(`http://localhost:3000/search/quote?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);


          this.quote = response;
          this.isLoading = false;
          // this.detailsService.setData('quote', this.responseDataQuote);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  private modalService = inject(NgbModal);
  closeResult=''
  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}
  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  openBuyModal(portfolio: any)
  {
    this.selectedPortfolio=portfolio;
  }

  buyStock(value:number){
    console.log("Value inside buyStock in portfolio comp:",value)
    this.stockBought=true;
        setTimeout(async() => {
          this.stockBought=false;
        }, 4000);
    // to update balance
    this.http.get(`http://localhost:3000/portfolio/buyStock1?ticker=${value}`).subscribe({
      next:(response:any)=>{
        console.log(response)
        // this.balance=response[0].balance
        // console.log(this.balance)
      }
    })

    const data = {
      ticker: this.tickerSymbol,
      name:this.selectedPortfolio.name,
      quantity:this.quantity,
      price:this.selectedPortfolio.price
    }
    console.log(data);

    // to update portfolio on the mongodb
    this.http.post('http://localhost:3000/portfolio/buyStock2',data).subscribe({
      next: (response) => {
        console.log(response);
        // if(response)
        // {
        //   this.isBought=true
        // }
        
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
    // this.quantity=0
    // this.getPortfolio()
  }

  sellStock(value:number){
    // value=parseFloat(value);
    console.log("Value inside buyStock in portfolio comp:",value);

    // to update balance
    this.http.get(`http://localhost:3000/portfolio/buyStock1?ticker=${value}`).subscribe({
      next:(response:any)=>{
        console.log(response)
        // this.balance=response[0].balance
        // console.log(this.balance)
      }
    })

    const data = {
      ticker: this.tickerSymbol,
      name:this.selectedPortfolio.name,
      quantity:this.quantity,
      price:this.selectedPortfolio.price
    }
    console.log(data);

    // to update portfolio on the mongodb
    this.http.post('http://localhost:3000/portfolio/sellStock',data).subscribe({
      next: (response) => {
        console.log(response);
        
        
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })


  }

}
