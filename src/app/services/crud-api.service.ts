import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudApiService {
  readonly financialsAPIUrl = 'https://localhost:44398/api';

  constructor(private http: HttpClient) {}

  // Users
  getUsersList(): Observable<any[]> {
    return this.http.get<any>(this.financialsAPIUrl + '/users');
  }

  addUsers(data: any) {
    return this.http.post(this.financialsAPIUrl + '/users', data);
  }

  updateUsers(id: number | string, data: any) {
    return this.http.put(this.financialsAPIUrl + `/users/${id}`, data);
  }

  deleteUsers(id: number | string) {
    return this.http.delete(this.financialsAPIUrl + `/users/${id}`);
  }

  // Transactions
  getTransactionsList(): Observable<any[]> {
    return this.http.get<any>(this.financialsAPIUrl + '/transactions');
  }

  addTransactions(data: any) {
    return this.http.post(this.financialsAPIUrl + '/transactions', data);
  }

  updateTransactions(id: number | string, data: any) {
    return this.http.put(this.financialsAPIUrl + `/transactions/${id}`, data);
  }

  deleteTransactions(id: number | string) {
    return this.http.delete(this.financialsAPIUrl + `/transactions/${id}`);
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
