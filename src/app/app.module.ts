import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFormComponent } from './search-form/search-form.component';
import { DetailsComponent } from './details/details.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

// import { HighchartsChartComponent } from 'highcharts-angular';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterComponent } from './footer/footer.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';

// import { Component, inject, TemplateRef } from '@angular/core';

import {  NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchFormComponent,
    DetailsComponent,
    WatchlistComponent,
    PortfolioComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    HighchartsChartModule,
    MatAutocompleteModule,
    NgbDatepickerModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
