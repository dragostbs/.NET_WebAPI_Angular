import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscoverApiService {
  constructor(private http: HttpClient) {}

  // getNews(): Observable<any[]> {
  //   let headers = new HttpHeaders({
  //     'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
  //     'X-RapidAPI-Host': 'bb-finance.p.rapidapi.com',
  //   });
  //   let url = `https://bb-finance.p.rapidapi.com/news/list`;

  //   return this.http.get<any>(url, { headers });
  // }

  // getMostActive(): Observable<any[]> {
  //   let headers = new HttpHeaders({
  //     'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
  //     'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com',
  //   });
  //   let url = `https://mboum-finance.p.rapidapi.com/co/collections/most_actives`;

  //   return this.http.get<any>(url, { headers });
  // }

  // getGainers(): Observable<any[]> {
  //   let headers = new HttpHeaders({
  //     'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
  //     'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
  //   });
  //   let url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_gainers`;

  //   return this.http.get<any>(url, { headers });
  // }

  // getFallers(): Observable<any[]> {
  //   let headers = new HttpHeaders({
  //     'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
  //     'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
  //   });
  //   let url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_losers`;

  //   return this.http.get<any>(url, { headers });
  // }
}
