import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  private timeout: any;
  loading: boolean = false;

  ngOnInit(): void {}

  start() {
    this.timeout = setTimeout(() => {
      this.loading = true;
    }, 2000);
  }

  finish() {
    this.timeout = setTimeout(() => {
      this.loading = false;
      clearTimeout(this.timeout);
    });
  }
}
