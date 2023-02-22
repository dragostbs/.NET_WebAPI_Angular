import { Component, OnInit } from '@angular/core';
import { Fallers, Gainers } from 'src/app/interfaces/interfaces';
import { DiscoverApiService } from 'src/app/services/discover-api.service';

@Component({
  selector: 'app-gainer-faller',
  templateUrl: './gainer-faller.component.html',
  styleUrls: ['./gainer-faller.component.scss'],
})
export class GainerFallerComponent implements OnInit {
  listGainers: Gainers[] = [];
  listFallers: Fallers[] = [];
  myMath = Math;

  constructor(private service: DiscoverApiService) {}

  ngOnInit(): void {
    // Get Gainers
    this.service.getGainers().subscribe((data) => {
      let { quotes }: any = data;

      for (let value of quotes) {
        const gainers: Gainers = {
          symbol: value.symbol,
          marketChangePercentage: value.regularMarketChangePercent,
        };

        this.listGainers.push(gainers);
      }
    });

    // Get Fallers
    this.service.getFallers().subscribe((data) => {
      let { quotes }: any = data;

      for (let value of quotes) {
        const fallers: Fallers = {
          symbol: value.symbol,
          marketChangePercentage: value.regularMarketChangePercent,
        };

        this.listFallers.push(fallers);
      }
    });
  }
}
