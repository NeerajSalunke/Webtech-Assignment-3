import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  @Input() responseDataProfile: any;
  @Input() responseDataQuote: any;
  @Input() responseDataPeers: any;
  @Input() isLoading:boolean=false;
  @Input() searchForm:any;
  @Input() onSubmit:any;


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
}
