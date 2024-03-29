import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, interval } from 'rxjs';
import { Router } from '@angular/router';
import { DetailsService } from 'src/services/details.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, tap } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';




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

  news1: any;
  news2: any;

  // @Input() searchPeer!: (peer: string) => void;
  // @Output() searchSubmitted: EventEmitter<string> = new EventEmitter<string>();
  // listenForSearchSubmit() {
  //   this.searchSubmitted.subscribe((peer: string) => {
  //     this.clearAll();
  //     this.searchForm.controls['ticker'].setValue(peer);
  //     this.onSubmit();
  //   });
  // }


  // currentTab:string='summary';


  isLoading: boolean = false;
  newTicker: boolean = false;
  isInputEmpty: boolean = false;
  invalidTicker: boolean = false;

  lineColor: string = '';

  constructor(
    public formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router,
    private detailsService: DetailsService,
    // public searchForm: FormGroup
  ) { }

  BASE_URL:any = 'http://localhost:3000';

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ ticker: '' });
    // console.log(this.searchForm);
    if (!this.newTicker) {
      this.responseDataProfile = this.detailsService.getData('profile');
      this.responseDataQuote = this.detailsService.getData('quote');
      this.responseDataPeers = this.detailsService.getData('peers');
      this.responseDataPolyHour = this.detailsService.getData('polyHour');
      this.responseDataRecTrends = this.detailsService.getData('recTren');
      this.responseDataCompEarn = this.detailsService.getData('compEarn');
      this.responseDataPolyTwoYr = this.detailsService.getData('polyTwoYr');

      this.news1 = this.detailsService.getData('news1');
      this.news2 = this.detailsService.getData('news2')

      if (this.responseDataSentiments = this.detailsService.getData('sentiments')) {
        this.showDetailsComp = true;
        // this.newTicker=true;
        this.searchForm.controls['ticker'].setValue(this.detailsService.getData('ticker'));
      }
    }

    console.log("from ngoninit in searchform", this.tickerSymbol);


    this.searchForm.get('ticker')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      if (this.searchForm.value.ticker != '') {
        this.isFetching = true;
        this.http.get(`${this.BASE_URL}/search/autocomplete?ticker=${value}`)
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

  refreshQuote() {
    this.fetchQuote();

    // interval(15000).subscribe(()=>{
    //   this.fetchQuote();
    // })
  }

  fetchQuote() {
    this.http.get(`${this.BASE_URL}/search/quote?ticker=${this.tickerSymbol}`)
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
  }

  onSubmit() {
    this.isLoading = true;
    this.newTicker = true;
    this.isInputEmpty = false;
    this.invalidTicker = false;
    this.tickerSymbol = this.searchForm.value.ticker.toUpperCase();
    if (this.tickerSymbol == '') {
      this.isInputEmpty = true;
      return;
    }
    // console.log(tickerSymbol);
    // console.log("Then why the hell not moving ahead!!!");

    // this.currentTab='summary';
    // this.showDetailsComp = true;
    // console.log(this.router);

    this.router.navigate(['/search/', this.tickerSymbol]);

    this.http.get(`${this.BASE_URL}/search/profile?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);
          if (Object.keys(response).length === 0) {
            this.invalidTicker = true;
            console.log("Invalid Ticker")
            return;
          }
          this.showDetailsComp = true;
          this.responseDataProfile = response;
          this.detailsService.setData('profile', this.responseDataProfile);
          this.detailsService.setData('ticker', this.tickerSymbol);
          // this.isLoading=false;
        },
        error: (error) => {
          // this.isLoading=false;
          console.error('Error:', error);
        }
      });

    // this.refreshQuote();
    this.http.get(`${this.BASE_URL}/search/quote?ticker=${this.tickerSymbol}`)
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
    interval(15000).subscribe(() => {
      this.http.get(`${this.BASE_URL}/search/quote?ticker=${this.detailsService.getData('ticker')}`)
        .subscribe({
          next: (response) => {
            // console.log(response);
            console.log("Running every 15 sec!")


            this.responseDataQuote = response;
            this.detailsService.setData('quote', this.responseDataQuote);

          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
    })

    // this.http.get(`http://localhost:3000/search/quote?ticker=${this.tickerSymbol}`)
    //   .subscribe({
    //     next: (response) => {
    //       // console.log(response);


    //       this.responseDataQuote = response;
    //       this.detailsService.setData('quote', this.responseDataQuote);
    //     },
    //     error: (error) => {
    //       console.error('Error:', error);
    //     }
    //   });

    this.http.get(`${this.BASE_URL}/search/peers?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.responseDataPeers = response;
          this.detailsService.setData('peers', this.responseDataPeers);
          // this.isLoading = false;
          this.newTicker = false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`${this.BASE_URL}/search/insights/insiderSentiments?ticker=${this.tickerSymbol}`)
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

    this.http.get(`${this.BASE_URL}/search/polygonHourly?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // this.newTicker=true;
          // console.log(response);
          this.responseDataPolyHour = response;
          this.detailsService.setData('polyHour', this.responseDataPolyHour);
          // if(this.responseDataQuote.d<0) 
          // {
          //   this.lineColor='#cd3131'
          //   this.detailsService.setData('lineColor', this.lineColor);
          //   console.log("Red liene color",this.lineColor)
          // }
          // else 
          // {
          //   this.lineColor='#6a9952'
          //   this.detailsService.setData('lineColor', this.lineColor);
          //   console.log("Green liene color")
          // }
          // this.isLoading=false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get(`${this.BASE_URL}/search/recTrends?ticker=${this.tickerSymbol}`)
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

    this.http.get(`${this.BASE_URL}/search/companyEarnings?ticker=${this.tickerSymbol}`)
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



    this.http.get(`${this.BASE_URL}/search/polygonTwoYr?ticker=${this.tickerSymbol}`)
      .subscribe({
        next: (response) => {
          // this.newTicker=true;
          // console.log(response);

          if (this.responseDataQuote.d < 0) {
            this.lineColor = '#cd3131'
            this.detailsService.setData('lineColor', this.lineColor);
            console.log("Red liene color", this.lineColor)
          }
          else {
            this.lineColor = '#6a9952'
            this.detailsService.setData('lineColor', this.lineColor);
            console.log("Green liene color")
          }

          this.responseDataPolyTwoYr = response;
          this.detailsService.setData('polyTwoYr', this.responseDataPolyTwoYr);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.get<any[]>(`${this.BASE_URL}/search/top_news?ticker=${this.tickerSymbol}`).subscribe({
      next: (response) => {
        // Filter out items with both image URL and headline
        const filteredResponse = response.filter(item => item.image && item.headline);
        // console.log("Filtered response toh dekho",filteredResponse);

        // Determine the length of the filtered response array
        const responseLength = filteredResponse.length;

        if (responseLength >= 20) {
          // If the filtered response has 20 or more items, take the first 20
          this.news1 = filteredResponse.slice(0, 10);
          this.news2 = filteredResponse.slice(10, 20);
        } else if (responseLength > 0) {
          // If the filtered response has fewer than 20 items but more than 0, divide them into two halves
          const halfLength = Math.ceil(responseLength / 2);
          this.news1 = filteredResponse.slice(0, halfLength);
          this.news2 = filteredResponse.slice(halfLength);
        } else {
          // If there are no items with both image URL and headline, set both news arrays to empty
          this.news1 = [];
          this.news2 = [];
        }

        this.detailsService.setData('news1', this.news1);
        this.detailsService.setData('news2', this.news2);
        // console.log("News 1 dekho - ",this.news1);
        // console.log("News2 dekho",this.news2);
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
    this.isInputEmpty = false;
    this.invalidTicker = false;


  }
  onInputChange(event: Event) {
    // this.listenForSearchSubmit();
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    if (value === '') {
      this.clearAll();
    }
  }
}
