import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';
import { DetailsComponent } from './details/details.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  {path: '',redirectTo:'/search/home', pathMatch:'full'},
  {path:'search', component: SearchFormComponent, children:[
    {path:'home', component: SearchFormComponent},
    {path: ':ticker',component: DetailsComponent},
  ]},
  {path: 'watchlist',component: WatchlistComponent},
  {path: 'portfolio',component: PortfolioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
