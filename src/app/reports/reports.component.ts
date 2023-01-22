import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';
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
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  transactions$!: Observable<any[]>;

  // Map to acces key data such as price, symbol... for transactions
  stockList: any = [];
  stockSymbolMap: Map<number, string> = new Map();
  stockPriceMap: Map<number, string> = new Map();

  constructor(private service: CrudApiService) {}

  ngOnInit(): void {
    this.transactions$ = this.service.getTransactionsList();
    this.StocksDataMap();

    this.loaderComponent.loading = true;
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

  removeTransactions(transaction: any) {
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

  // Inject this functon for trade component to show the data instantly once submitted
  callAllDataTransactions() {
    this.transactions$ = this.service.getTransactionsList();
    this.StocksDataMap();
  }
}
