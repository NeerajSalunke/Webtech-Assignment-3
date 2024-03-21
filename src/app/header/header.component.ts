import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  ticker:any='home';
 constructor(public router:Router)
 {
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        if(event.url === '/search/home' || event.url.startsWith('/search/'))
        {
          document.getElementById("searchLink")?.classList.add('active');
          let str=event.url;
          let lastindex = str.lastIndexOf('/');
          if(str.substring(lastindex+1)!='home')
          {
            this.ticker=str.substring(lastindex+1);
            
          }
          
        }
        else
        {
          document.getElementById("searchLink")?.classList.remove('active');
        }
      }
    })
 }

}
