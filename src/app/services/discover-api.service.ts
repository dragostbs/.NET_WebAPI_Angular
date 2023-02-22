import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fallers, Gainers, News, Volume } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DiscoverApiService {
  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    let headers = new HttpHeaders({
      'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
      'X-RapidAPI-Host': 'bb-finance.p.rapidapi.com',
    });
    let url = `https://bb-finance.p.rapidapi.com/news/list`;

    return this.http.get<News[]>(url, { headers });
  }

  getMostActive(): Observable<Volume[]> {
    let headers = new HttpHeaders({
      'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
      'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com',
    });
    let url = `https://mboum-finance.p.rapidapi.com/co/collections/most_actives`;

    return this.http.get<Volume[]>(url, { headers });
  }

  getGainers(): Observable<Gainers[]> {
    let headers = new HttpHeaders({
      'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
    });
    let url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_gainers`;

    return this.http.get<Gainers[]>(url, { headers });
  }

  getFallers(): Observable<Fallers[]> {
    let headers = new HttpHeaders({
      'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
    });
    let url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_losers`;

    return this.http.get<Fallers[]>(url, { headers });
  }
}
