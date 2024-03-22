import { Component } from '@angular/core';
import { SearchFormComponent } from './search-form/search-form.component';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // standalone: true,
  // imports: [HighchartsChartModule],
})
export class AppComponent {
  title = 'stock-market';
  
}
