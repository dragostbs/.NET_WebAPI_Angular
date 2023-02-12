import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsComponent } from '../reports/reports.component';
import { CrudApiService } from '../services/crud-api.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  transactionForm!: FormGroup;

  constructor(
    private service: CrudApiService,
    private fb: FormBuilder,
    private reportComponent: ReportsComponent
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      result: ['Buy', [Validators.required]],
      date: [new Date()],
      stock: this.fb.group({
        symbol: ['', [Validators.required, Validators.maxLength(10)]],
        price: [
          '0.1',
          [Validators.required, Validators.max(500), Validators.min(0.1)],
        ],
      }),
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
        }, 5000);

        // Call the function to get all the data once submitted from the form using service and inject
        this.reportComponent.callAllDataTransactions();
        this.transactionForm.reset({
          result: 'Buy',
          date: '',
          stock: {
            symbol: '',
            price: '0.1',
          },
        });
      });
  }
}
