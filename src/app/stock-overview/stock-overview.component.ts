import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Plotly from 'plotly.js';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-stock-overview',
  templateUrl: './stock-overview.component.html',
  styleUrls: ['./stock-overview.component.css']
})
export class StockOverviewComponent {

  private data;
  private _hasDailyData;
  private _has1MinData;
  private get hasDailyData() {
    return this._hasDailyData;
  }
  private set hasDailyData(value) {
     this._hasDailyData = value;
     this._has1MinData = false;
  }

  private get has1MinData() {
    return this._has1MinData;
  }
  private set has1MinData(value) {
     this._hasDailyData = false;
     this._has1MinData = value;
  }
  public chartId = 'Tester';

  constructor(private http: HttpClient) {}

  fiveYearSubmit(value: any) {

    if (this.hasDailyData) {
      this.plotChart(this.parseData('Time Series (Daily)', { year: 5 } ));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (Daily)', { alphavantageOption: { daily: true }, parseDataOption: { year: 5 } });
    }
    this.hasDailyData= true;
  }

  oneYearSubmit(value: any) {

    if (this.hasDailyData) {
      this.plotChart(this.parseData('Time Series (Daily)', {year: 1 } ));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (Daily)', { alphavantageOption: { daily: true }, parseDataOption: { year: 1 } });
    }
    this.hasDailyData= true;
  }

  sixMonthSubmit(value: any) {

    if (this.hasDailyData) {
      this.plotChart(this.parseData('Time Series (Daily)', { month: 6 } ));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (Daily)', { alphavantageOption: { daily: true }, parseDataOption: { month: 6 } });
    }
    this.hasDailyData= true;
  }

  oneMonthSubmit(value: any) {

    if (this.hasDailyData) {
      this.plotChart(this.parseData('Time Series (Daily)', { month: 0 }));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (Daily)', { alphavantageOption: { daily: true }, parseDataOption: { month: 0 } });
    }
    this.hasDailyData= true;
  }

  ytdSubmit(value: any) {

    if (this.hasDailyData) {
      this.plotChart(this.parseData('Time Series (Daily)', { year: 0 }));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (Daily)', { alphavantageOption: { daily: true }, parseDataOption: { year: 0 } });
    }
    this.hasDailyData= true;
  }

  maxYearSubmit(value: any) {

    if (this.hasDailyData) {
      this.plotChart(this.parseData('Time Series (Daily)', { year: 0 } ));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (Daily)', { alphavantageOption: { daily: true }, parseDataOption: { year: 40 } });
    }
    this.hasDailyData= true;
  }

  fiveDaySubmit(value) {

    if (this.has1MinData) {
      this.plotChart(this.parseData('Time Series (1min)', { day: 5 } ));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (1min)', { alphavantageOption: {}, parseDataOption: { day: 5 } });
    }
    this.has1MinData= true;
  }

  submit(value: any) {

    if (this.has1MinData) {
      this.plotChart(this.parseData('Time Series (1min)', { day: 0 } ));
    }
    else {
      this.callAlphaVantage(value, 'Time Series (1min)', { alphavantageOption: {}, parseDataOption: { day: 0 } });
    }
    this.has1MinData= true;
  }

  private callAlphaVantage(value, key, option) {
    this.http.get(this.generateAlphaVantageUrl(value, option.alphavantageOption)).subscribe(data => {
      console.log(data);
      this.data = data;
      this.plotChart(this.parseData(key, option.parseDataOption));
    });
  }

  private parseData(key, parseDataOption) {
    let yaxis = [];
    let xaxis = [];
    let begin = this.getBeginDate(parseDataOption);
    let end = this.getEndDate();

    for(let d in this.data[key]) {
      const dd = new Date(d.replace(' ', 'T'));

      if ( dd >= begin && dd <= end ) {
        xaxis.push(d);
        yaxis.push(this.data[key][d]['4. close']);
      }
    }
    return { 
      y: yaxis,
      x: xaxis
    }
  }
  private getEndDate() {
    const date = new Date();

    if (date.getDay() === 6) {
      date.setDate(date.getDate() - 1);
    }
    else if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }
    let year = date.getFullYear();
    let day: any = date.getDate();

    if( day < 10) {
      day = `${0}${day}`;
    }
    let month: any = date.getMonth() + 1; // January is 0

    if( month < 10) {
      month = `${0}${month}`;
    }
    return new Date(`${year}-${month}-${day}T23:59:59`);
  }

  private getBeginDate(option) {
    const date = new Date();

    if (date.getDay() === 6) {
      date.setDate(date.getDate() -1);
    }
    else if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }

    if (option.day || option.day === 0) {
        date.setDate(date.getDate() - option.day);

        if (date.getDay() === 6) {
          date.setDate(date.getDate() -1);
        }
        else if (date.getDay() === 0) {
          date.setDate(date.getDate() + 1);
        }
    }

    if (option.month || option.month === 0) {
      date.setMonth(date.getMonth() - option.month);
      date.setDate(0);
    }

    if (option.year || option.year === 0 ) {
      date.setFullYear(date.getFullYear() - option.year);
      date.setMonth(0);
      date.setDate(0);
    }
    let year = date.getFullYear();
    let day: any = date.getDate();

    if( day < 10) {
      day = `${0}${day}`;
    }
    let month: any = date.getMonth() + 1; // January is 0

    if( month < 10) {
      month = `${0}${month}`;
    }
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

  private plotChart(data): void {
    Plotly.newPlot('Tester', [{
      x: data.x.reverse(),
      y: data.y.reverse()
    }], {
      margin: { t: 0 }
    });
  }

  private generateAlphaVantageUrl(symbol, options) {
    let f = 'TIME_SERIES_INTRADAY';
    let i = '&interval=1min';
    let apiKey = '&apikey=demo';
    let c = '&outputsize=full'
    if(options.daily) {
      f = 'TIME_SERIES_DAILY';
      i = '';
    }

    if(options.compact) {
      c = '&outputsize=compact';
    }
    return `https://www.alphavantage.co/query?function=${f}&symbol=${symbol}${c}${i}${apiKey}`
  }
}
