import { Component, Injectable, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts/types/dist/echarts';
import { Observable } from 'rxjs';
import { LoadService } from '../loading/load.service';
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
  transactions$!: Observable<any[]>;
  loadingElement: EChartsOption = {};

  // Map to acces key data such as price, symbol... for transactions
  stockList: any = [];
  stockSymbolMap: Map<number, string> = new Map();
  stockPriceMap: Map<number, string> = new Map();

  constructor(
    private service: CrudApiService,
    public loadingService: LoadService,
    private charts: ChartsService
  ) {}

  ngOnInit(): void {
    this.transactions$ = this.service.getTransactionsList();
    this.StocksDataMap();

    this.loadingElement = this.charts.loadingElement();
    this.loadingEffect();
  }

  // GET data from API
  StocksDataMap() {
    this.loadingEffect();
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

  removeTransactions(transaction: any) {
    this.loadingEffect();
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
      }, 6000);

      this.transactions$ = this.service.getTransactionsList();
    });
  }

  // Inject this function for trade component to show the data instantly once submitted
  callAllDataTransactions() {
    this.transactions$ = this.service.getTransactionsList();
    this.StocksDataMap();
  }

  loadingEffect() {
    const main = document.getElementById('main');
    if (main) {
      main.style.display = 'none';
    }
    setTimeout(() => {
      if (main) {
        main.style.display = 'block';
      }
    }, 2000);
  }
}
