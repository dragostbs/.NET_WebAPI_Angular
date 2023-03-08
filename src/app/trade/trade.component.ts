import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadService } from '../loading/load.service';
import { ReportsComponent } from '../reports/reports.component';
import { CandlesApiService } from '../services/candles-api.service';
import { CrudApiService } from '../services/crud-api.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  transactionForm!: FormGroup;
  showInputs: boolean = false;
  symbolReadOnly: boolean = false;

  constructor(
    private service: CrudApiService,
    private fb: FormBuilder,
    private reportComponent: ReportsComponent,
    private dataCandles: CandlesApiService,
    public loadingService: LoadService
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      result: ['Buy', [Validators.required]],
      date: [new Date().toISOString(), [Validators.required]],
      symbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
      ],
      price: [0, [Validators.required]],
    });
  }

  // Trade based on data from API Candles
  onSelect(symbol: string) {
    this.loadingEffect();
    this.symbolReadOnly = true;

    this.dataCandles.getCandlesData(symbol).subscribe((data) => {
      if (Object.entries(data).length === 0) {
        alert('🌋 The Stock could not be found !!!');
        this.transactionForm.reset({
          symbol: '',
        });
        this.showInputs = false;
      } else {
        let lastValue;

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            lastValue = parseFloat(data[key].Close.toFixed(2));
          }
        }
        this.transactionForm.controls['price'].setValue(lastValue);
        this.showInputs = true;
      }
    });
  }

  submitTransaction() {
    // POST to database
    this.service
      .addTransactions(this.transactionForm.value)
      .subscribe((res) => {
        // Show success message
        const showSuccess = document.getElementById('add-success-alert');
        if (showSuccess) {
          showSuccess.style.display = 'block';
        }
        setTimeout(() => {
          if (showSuccess) {
            showSuccess.style.display = 'none';
          }
        }, 4000);

        // Call the function to get all the data once submitted from the form using service and inject
        this.reportComponent.callAllDataTransactions();
        this.transactionForm.reset({
          result: 'Buy',
          date: new Date().toISOString(),
          symbol: '',
          price: 0,
        });

        this.showInputs = false;
      });
  }

  changeStock() {
    this.transactionForm.reset({
      result: 'Buy',
      date: new Date().toISOString(),
      symbol: '',
      price: 0,
    });

    this.showInputs = false;
    this.symbolReadOnly = false;
  }

  loadingEffect() {
    this.loadingService.setTradeLoadingEffect(1200);
  }
}
