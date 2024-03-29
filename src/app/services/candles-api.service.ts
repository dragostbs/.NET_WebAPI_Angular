import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BYPASS_INTERCEPTOR } from '../loading/interceptor.service';

@Injectable({
  providedIn: 'root',
})
export class CandlesApiService {
  constructor(private http: HttpClient) {}

  getCandlesData(stockSymbol: string): Observable<any[]> {
    let headers = new HttpHeaders({
      'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
      'X-RapidAPI-Host': 'stock-prices2.p.rapidapi.com',
    });
    let url = `https://stock-prices2.p.rapidapi.com/api/v1/resources/stock-prices/2y?ticker=${stockSymbol}`;

    return this.http.get<any>(url, {
      headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR, true),
    });
  }
}
