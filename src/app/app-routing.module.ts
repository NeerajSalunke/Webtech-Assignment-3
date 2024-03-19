import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {path: '',redirectTo:'/search/home', pathMatch:'full'},
  {path:'search', component: SearchFormComponent, children:[
    {path:'home', component: SearchFormComponent},
    {path: ':ticker',component: DetailsComponent},
  ]},
  // {path: '/watchlist',component: WatchListComponent},
  // {path: '/portfolio',component: PortfolioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
