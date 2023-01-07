import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';
import { CrudApiService } from '../services/crud-api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  transactions$!: Observable<any[]>;

  // Map to acces key data such as price, name... for transactions
  stockList: any = [];
  stockSymbolMap: Map<number, string> = new Map();
  stockPriceMap: Map<number, string> = new Map();

  userList: any = [];
  userNameMap: Map<number, string> = new Map();

  constructor(private service: CrudApiService) {}

  ngOnInit(): void {
    this.transactions$ = this.service.getTransactionsList();

    this.StocksDataMap();
    this.UsersDataMap();

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

  UsersDataMap() {
    this.service.getUsersList().subscribe((data) => {
      // assign the data to stockList variable
      this.userList = data;

      for (let i = 0; i < data.length; i++) {
        // GET by id the username
        this.userNameMap.set(this.userList[i].id, this.userList[i].username);
      }
    });
  }
}
