import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudApiService } from '../services/crud-api.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  transactionForm!: FormGroup;

  constructor(private service: CrudApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      result: ['Buy', [Validators.required]],
      date: [new Date()],
      user: this.fb.group({
        username: ['', [Validators.required, Validators.maxLength(10)]],
      }),
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
        // Show success and error message
        var showSuccess = document.getElementById('add-success-alert');

        if (showSuccess) {
          showSuccess.style.display = 'block';
        }

        setTimeout(() => {
          if (showSuccess) {
            showSuccess.style.display = 'none';
          }
        }, 4000);
      });
  }
}
