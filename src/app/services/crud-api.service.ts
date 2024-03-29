import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transactions } from '../interfaces/interfaces';
import { BYPASS_INTERCEPTOR } from '../loading/interceptor.service';

@Injectable({
  providedIn: 'root',
})
export class CrudApiService {
  readonly financialsAPIUrl = 'https://localhost:44398/api';

  constructor(private http: HttpClient) {}

  // Transactions
  getTransactionsList(): Observable<Transactions[]> {
    return this.http.get<Transactions[]>(
      this.financialsAPIUrl + '/transactions',
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR, true),
        ...this.getToken(),
      }
    );
  }

  addTransactions(data: Transactions) {
    return this.http.post(this.financialsAPIUrl + '/transactions', data, {
      context: new HttpContext().set(BYPASS_INTERCEPTOR, true),
      ...this.getToken(),
    });
  }

  updateTransactions(id: number | string, data: Transactions) {
    return this.http.put(
      this.financialsAPIUrl + `/transactions/${id}`,
      data,
      this.getToken()
    );
  }

  deleteTransactions(id: number | string) {
    return this.http.delete(this.financialsAPIUrl + `/transactions/${id}`, {
      context: new HttpContext().set(BYPASS_INTERCEPTOR, true),
      ...this.getToken(),
    });
  }

  // Adding the token once logged in, withou it we can't use the transaction methods
  getToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return httpOptions;
  }

  // Stocks
  getStocksList(): Observable<any[]> {
    return this.http.get<any>(this.financialsAPIUrl + '/stocks');
  }

  addStocks(data: any) {
    return this.http.post(this.financialsAPIUrl + '/stocks', data);
  }

  updateStocks(id: number | string, data: any) {
    return this.http.put(this.financialsAPIUrl + `/stocks/${id}`, data);
  }

  deleteStocks(id: number | string) {
    return this.http.delete(this.financialsAPIUrl + `/stocks/${id}`);
  }
}
