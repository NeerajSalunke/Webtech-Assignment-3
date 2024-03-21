import { Component, Input, OnInit } from '@angular/core';
import { DetailsService } from 'src/services/details.service';

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
  @Input() isLoading:boolean=false;
  @Input() searchForm:any;
  @Input() onSubmit:any;

  // constructor(private detailsService: DetailsService) { }

  ngOnInit(): void {
    // this.responseDataProfile = this.detailsService.getData('profile');
    // this.responseDataQuote = this.detailsService.getData('quote');
    // this.responseDataPeers = this.detailsService.getData('peers');
    // this.responseDataSentiments = this.detailsService.getData('sentiments');
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

  searchPeer(peer:string)
  {
    this.searchForm.controls['ticker'].setValue(peer);
    this.onSubmit();
  }

  aggregateMSPR(key:string)
  {
    let totalMsprPos=0,totalMspr=0;
    for (let i = 0; i < this.responseDataSentiments.data.length; i++) {
      let mspr = this.responseDataSentiments.data[i].mspr;
      totalMspr+=mspr;
      if(mspr>0)
      {
        totalMsprPos+=mspr;
      }
    }
    let totalMsprNeg=totalMspr-totalMsprPos;
    // console.log(totalMspr)
    // console.log(totalMsprPos)
    // console.log(totalMsprNeg)
    if(key=="t") return totalMspr.toFixed(2);
    else if(key=="p") return totalMsprPos.toFixed(2);
    return totalMsprNeg.toFixed(2);
  }

  aggregateChange(key:string)
  {
    let totalChangePos=0,totalChange=0;
    for (let i = 0; i < this.responseDataSentiments.data.length; i++) {
      let change = this.responseDataSentiments.data[i].change;
      totalChange+=change;
      if(change>0)
      {
        totalChangePos+=change;
      }
    }
    let totalChangeNeg=totalChange-totalChangePos;
    // console.log(totalMspr)
    // console.log(totalMsprPos)
    // console.log(totalMsprNeg)
    if(key=="t") return totalChange;
    else if(key=="p") return totalChangePos;
    return totalChangeNeg;
  }


}
