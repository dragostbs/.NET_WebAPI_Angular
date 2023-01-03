import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 4000);
  }
}
