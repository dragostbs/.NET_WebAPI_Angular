import { Component, Injectable, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts/types/dist/echarts';
import { Observable, of } from 'rxjs';
import { Stock, Transactions } from '../interfaces/interfaces';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { ChartsService } from '../services/charts.service';
import { CrudApiService } from '../services/crud-api.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  sortOrder: boolean = true;

  transactions$!: Observable<Transactions[]>;
  loadingElement: EChartsOption = {};

  // Map to acces key data such as price, symbol... for transactions
  stockList: Stock[] = [];
  stockSymbolMap: Map<number, string> = new Map();
  stockPriceMap: Map<number, string> = new Map();

  constructor(
    private service: CrudApiService,
    public loadingService: LoadService,
    private charts: ChartsService,
    private pdfService: AnalysisApiService
  ) {}

  ngOnInit(): void {
    this.transactions$ = this.service.getTransactionsList();
    this.StocksDataMap();

    this.loadingElement = this.charts.loadingElement();

    this.loadingEffect();
  }

  sortTable(key: keyof Transactions) {
    this.sortOrder = !this.sortOrder;
    this.transactions$.subscribe((transactions) => {
      transactions.sort((a, b) => {
        if (this.sortOrder) {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return b[key] > a[key] ? 1 : -1;
        }
      });
      this.transactions$ = of(transactions);
    });
  }

  savePDF() {
    this.pdfService.downloadPDF();
  }

  // GET data from API
  StocksDataMap() {
    this.service.getStocksList().subscribe((data) => {
      // assign the data to stockList variable
      this.stockList = data;
      for (let i = 0; i < data.length; i++) {
        // GET by id the symbol and the price
        this.stockSymbolMap.set(this.stockList[i].id, this.stockList[i].symbol);
        this.stockPriceMap.set(this.stockList[i].id, this.stockList[i].price);
      }
    });
  }

  removeTransactions(transaction: Transactions) {
    this.service.deleteTransactions(transaction.id).subscribe((data) => {
      // Show success message
      const showRemove = document.getElementById('add-remove-alert');

      if (showRemove) {
        showRemove.style.display = 'block';
      }

      setTimeout(() => {
        if (showRemove) {
          showRemove.style.display = 'none';
        }
      }, 4000);

      this.transactions$ = this.service.getTransactionsList();
    });
  }

  // Inject this function for trade component to show the data instantly once submitted
  callAllDataTransactions() {
    this.transactions$ = this.service.getTransactionsList();
    this.StocksDataMap();
  }

  loadingEffect() {
    this.loadingService.setLoadingEffect(1000);
  }
}
