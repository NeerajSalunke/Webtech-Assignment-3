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
  showDetailsComp: boolean=false;
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
    this.showDetailsComp=true;
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
        this.isLoading=false;
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

  searchPeer(peer:string)
  {
    this.searchForm.controls['ticker'].setValue(peer);
    this.onSubmit();
  }
  clearAll()
  {
    // this.responseDataPeers=null;
    // this.responseDataProfile=null;
    // this.responseDataQuote=null;
    this.searchForm.controls['ticker'].setValue('');
    this.showDetailsComp=false;
    this.router.navigate(['/search/home']); 
  

  }
}
