import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { DetailsService } from 'src/services/details.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, tap } from 'rxjs/operators';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  // standalone: true,
  // imports: [MatAutocompleteModule],
})
export class SearchFormComponent implements OnInit {
  searchForm!: FormGroup;
  responseDataProfile: any;
  responseDataQuote: any;
  responseDataPeers: any;
  responseDataSentiments: any;
  responseDataPolyHour: any;
  responseDataRecTrends: any;
  responseDataCompEarn: any;
  responseDataPolyTwoYr: any;
  showDetailsComp: boolean = false;
  tickerSymbol: any;
  options: any;
  filteredOptions: any[] = [];
  isFetching: boolean = false;

  @Input() searchPeer!: (peer: string) => void;



  // currentTab:string='summary';


  isLoading: boolean = false;
  newTicker:boolean=false;
  isInputEmpty:boolean=false;
  invalidTicker:boolean=false;

  constructor(
    public formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router,
    private detailsService: DetailsService,
    // public searchForm: FormGroup
  ) { }



  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ ticker: '' });
    // console.log(this.searchForm);
    if(!this.newTicker)
    {
      this.responseDataProfile = this.detailsService.getData('profile');
      this.responseDataQuote = this.detailsService.getData('quote');
      this.responseDataPeers = this.detailsService.getData('peers');
      this.responseDataPolyHour = this.detailsService.getData('polyHour');
      this.responseDataRecTrends = this.detailsService.getData('recTren');
      this.responseDataCompEarn = this.detailsService.getData('compEarn');
      this.responseDataPolyTwoYr = this.detailsService.getData('polyTwoYr');
      if (this.responseDataSentiments = this.detailsService.getData('sentiments')) {
        this.showDetailsComp = true;
        // this.newTicker=true;
        this.searchForm.controls['ticker'].setValue(this.detailsService.getData('ticker'));
      }
    }

    
    

    this.searchForm.get('ticker')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      if(this.searchForm.value.ticker!='')
      {
        this.isFetching = true;
        this.http.get(`http://localhost:3000/search/autocomplete?ticker=${value}`)
          .subscribe({
            next: (response) => {
              // console.log(response);
              this.filterAutocomplete(response);
              // this.options = response;
  
              // this.detailsService.setData('profile', this.responseDataProfile);
              // this.detailsService.setData('ticker', this.tickerSymbol);
            },
            error: (error) => {
              console.error('Error:', error);
            }
          });
      }
    })

  }



  // onInputChange(value: string) {
    // this.isFetching=true;
    // this.http.get(`http://localhost:3000/search/autocomplete?ticker=${value}`)
    //   .subscribe({
    //     next: (response) => {
    //       // console.log(response);
    //       this.iterateAutocomplete(response);
    //       // this.options = response;

    //       // this.detailsService.setData('profile', this.responseDataProfile);
    //       // this.detailsService.setData('ticker', this.tickerSymbol);
    //     },
    //     error: (error) => {
    //       console.error('Error:', error);
    //     }
    //   });
  // }

  filterAutocomplete(response: any) {
    this.filteredOptions = [];
    response.result.forEach((element: { symbol: string, type: string, description: string }) => {
      if (element.type == "Common Stock" && !element.symbol.includes(".")) {
        this.filteredOptions.push([
          element.symbol,
          element.description
        ]);
      }
    });
    this.isFetching = false;
  }

  onSubmit() {
    this.isLoading = true;
    this.newTicker=true;
    this.isInputEmpty=false;
    this.invalidTicker=false;
    this.tickerSymbol = this.searchForm.value.ticker;
    if(this.tickerSymbol=='')
    {
      this.isInputEmpty=true;
      return;
    }
    // console.log(tickerSymbol);
    // console.log("Then why the hell not moving ahead!!!");

    // this.currentTab='summary';
    // this.showDetailsComp = true;
    // console.log(this.router);

    this.router.navigate(['/search/', this.tickerSymbol]);

    this.http.get(`http://localhost:3000/search/profile?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);
          if(Object.keys(response).length===0)
          {
            this.invalidTicker=true;
            console.log("Invalid Ticker")
            return;
          }
          this.showDetailsComp = true;
          this.responseDataProfile = response;
          this.detailsService.setData('profile', this.responseDataProfile);
          this.detailsService.setData('ticker', this.tickerSymbol);
        },
        error: (error) => {
          // this.isLoading=false;
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/quote?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);
          

          this.responseDataQuote = response;
          this.detailsService.setData('quote', this.responseDataQuote);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/peers?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.responseDataPeers = response;
          this.detailsService.setData('peers', this.responseDataPeers);
          // this.isLoading = false;
          this.newTicker=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/insights/insiderSentiments?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.responseDataSentiments = response;
          this.detailsService.setData('sentiments', this.responseDataSentiments);
          // this.isLoading=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/polygonHourly?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // this.newTicker=true;
          // console.log(response);
          this.responseDataPolyHour = response;
          this.detailsService.setData('polyHour', this.responseDataPolyHour);
          this.isLoading=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/recTrends?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // this.newTicker=true;
          // console.log(response);
          this.responseDataRecTrends = response;
          this.detailsService.setData('recTren', this.responseDataRecTrends);
          // this.isLoading=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/companyEarnings?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // this.newTicker=true;
          // console.log(response);
          this.responseDataCompEarn = response;
          this.detailsService.setData('compEarn', this.responseDataCompEarn);
          // this.isLoading=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`http://localhost:3000/search/polygonTwoYr?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // this.newTicker=true;
          // console.log(response);
          this.responseDataPolyTwoYr = response;
          this.detailsService.setData('polyTwoYr', this.responseDataPolyTwoYr);
          // this.isLoading=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });



  }



  // showTab(clickedTab:string)
  // {
  //   this.currentTab=clickedTab;
  // }

  // searchPeer(peer: string) {
  //   this.searchForm.controls['ticker'].setValue(peer);
  //   this.onSubmit();
  // }
  onPeerClicked(peer: string) {
    this.onSubmit();
  }
  clearAll() {
    // this.responseDataPeers=null;
    // this.responseDataProfile=null;
    // this.responseDataQuote=null;
    this.searchForm.controls['ticker'].setValue('');
    this.showDetailsComp = false;
    this.router.navigate(['/search/home']);
    this.isInputEmpty=false;
    this.invalidTicker=false;


  }
}
