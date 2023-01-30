import { Component, OnInit } from '@angular/core';
import { DiscoverApiService } from 'src/app/services/discover-api.service';

@Component({
  selector: 'app-gainer-faller',
  templateUrl: './gainer-faller.component.html',
  styleUrls: ['./gainer-faller.component.scss'],
})
export class GainerFallerComponent implements OnInit {
  listGainers: any = [];
  listFallers: any = [];
  myMath = Math;

  constructor(private service: DiscoverApiService) {}

  ngOnInit(): void {
    // Get Gainers
    this.service.getGainers().subscribe((data) => {
      for (let [key, value] of Object.entries(data)) {
        this.listGainers.push(value);
      }
    });

    // Get Fallers
    this.service.getFallers().subscribe((data) => {
      for (let [key, value] of Object.entries(data)) {
        this.listFallers.push(value);
      }
    });
  }
}
