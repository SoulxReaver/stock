import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-overview',
  templateUrl: './stock-overview.component.html',
  styleUrls: ['./stock-overview.component.css']
})
export class StockOverviewComponent implements OnInit {
  stockSymbol = '';

  constructor(private http: HttpClient) { }
  

  ngOnInit(): void {
    
  }

  submit(value: any) {
    this.stockSymbol = value;
    this.http.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.stockSymbol}&interval=1min&apikey=demo`).subscribe(data => {
      console.log(data);
    });
  }

}
