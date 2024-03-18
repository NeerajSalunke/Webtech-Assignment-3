import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { SearchFormComponent } from './search-form/search-form.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  // {path: '',component: SearchFormComponent},
  {path: 'details/:ticker',component: DetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
