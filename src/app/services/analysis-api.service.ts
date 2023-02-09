import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class AnalysisApiService {
  constructor(private http: HttpClient) {}

  getAnalysis(stockSymbol: string): Observable<any[]> {
    let headers = new HttpHeaders({
      'X-RapidAPI-Key': '0c05622b60mshb5bfb15bdb325a5p126430jsnad8533cae890',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
    });
    let url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-balance-sheet?symbol=${stockSymbol}&region=US`;

    return this.http.get<any>(url, { headers });
  }

  downloadPDF() {
    let data: any = document.getElementById('analysis');
    html2canvas(data).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 2;
      PDF.addImage(FILEURI, 'PNG', 1, position, fileWidth, fileHeight);
      PDF.save('financials.pdf');
    });
  }
}
