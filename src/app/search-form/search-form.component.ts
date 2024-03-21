import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { DetailsService } from 'src/services/details.service';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  // standalone: true,
  // imports: [MatTabsModule],
})
export class SearchFormComponent implements OnInit {
  searchForm!: FormGroup;
  responseDataProfile: any;
  responseDataQuote: any;
  responseDataPeers: any;
  responseDataSentiments: any;
  showDetailsComp: boolean = false;

  // currentTab:string='summary';


  isLoading: boolean = false;

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
    this.responseDataProfile = this.detailsService.getData('profile');
    this.responseDataQuote = this.detailsService.getData('quote');
    this.responseDataPeers = this.detailsService.getData('peers');
    // this.responseDataSentiments = this.detailsService.getData('sentiments');
    if(this.responseDataSentiments = this.detailsService.getData('sentiments'))
    {
      this.showDetailsComp=true;
      this.searchForm.controls['ticker'].setValue(this.detailsService.getData('ticker'));
    }
  }


  onSubmit() {
    this.isLoading = true;
    const tickerSymbol = this.searchForm.value.ticker;
    console.log(tickerSymbol);
    // this.currentTab='summary';
    this.showDetailsComp = true;
    this.router.navigate(['/search/', tickerSymbol]);

    this.http.post('http://localhost:3000/search/profile', { ticker: tickerSymbol })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.responseDataProfile = response;
          this.detailsService.setData('profile', this.responseDataProfile);
          this.detailsService.setData('ticker', tickerSymbol);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.post('http://localhost:3000/search/quote', { ticker: tickerSymbol })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.responseDataQuote = response;
          this.detailsService.setData('quote', this.responseDataQuote);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.post('http://localhost:3000/search/peers', { ticker: tickerSymbol })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.responseDataPeers = response;
          this.detailsService.setData('peers', this.responseDataPeers);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });

    this.http.post('http://localhost:3000/search/insights/insiderSentiments', { ticker: tickerSymbol })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.responseDataSentiments = response;
          this.detailsService.setData('sentiments', this.responseDataSentiments);
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

  searchPeer(peer: string) {
    this.searchForm.controls['ticker'].setValue(peer);
    this.onSubmit();
  }
  clearAll() {
    // this.responseDataPeers=null;
    // this.responseDataProfile=null;
    // this.responseDataQuote=null;
    this.searchForm.controls['ticker'].setValue('');
    this.showDetailsComp = false;
    this.router.navigate(['/search/home']);


  }
}
