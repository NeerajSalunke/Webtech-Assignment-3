import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  // standalone: true,
  // imports: [MatTabsModule],
})
export class SearchFormComponent implements OnInit {
  searchForm!: FormGroup;
  responseDataProfile:any;
  responseDataQuote:any;
  responseDataPeers:any;
  // currentTab:string='summary';

  isLoading:boolean=false;

  constructor(
    public formBuilder:FormBuilder,
    public http: HttpClient,
    private router: Router
    // public searchForm: FormGroup
  ){}

  ngOnInit(): void {
      this.searchForm = this.formBuilder.group({ticker:''});
      // console.log(this.searchForm);
  }


  onSubmit(){
    this.isLoading=true;
    const tickerSymbol = this.searchForm.value.ticker;
    console.log(tickerSymbol);
    // this.currentTab='summary';
    this.router.navigate(['/search/', tickerSymbol]); 

    this.http.post('http://localhost:3000/search/profile', { ticker: tickerSymbol })
    .subscribe({
      next: (response) => {
        console.log(response);
        this.responseDataProfile=response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

    this.http.post('http://localhost:3000/search/quote', { ticker: tickerSymbol })
    .subscribe({
      next: (response) => {
        console.log(response);
        this.responseDataQuote=response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    
    this.http.post('http://localhost:3000/search/peers', { ticker: tickerSymbol })
    .subscribe({
      next: (response) => {
        console.log(response);
        this.responseDataPeers=response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    
    this.isLoading=false;
  }

  formatDate(timestamp:number): string {
    const date = new Date(timestamp*1000);
    const year=date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }  
  timeDiff(timestamp1:number): boolean{
    const date1 = new Date(timestamp1*1000);
    const currentDate = new Date();
    // console.log(date1);
    // console.log(currentDate);
    const diff = Math.abs(currentDate.getTime() - date1.getTime());
    if(diff/1000 > 60)
    {
      // console.log(diff)
      return false;
    }
    return true;
  }
  // showTab(clickedTab:string)
  // {
  //   this.currentTab=clickedTab;
  // }

  searchPeer(peer:string)
  {
    this.searchForm.controls['ticker'].setValue(peer);
    this.onSubmit();
  }
  clearAll()
  {
    this.responseDataPeers=null;
    this.responseDataProfile=null;
    this.responseDataQuote=null;
    this.searchForm.controls['ticker'].setValue('');
  }
}
