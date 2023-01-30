import { Component, OnInit } from '@angular/core';
import { DiscoverApiService } from 'src/app/services/discover-api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  listNews: any = [];

  constructor(private service: DiscoverApiService) {}

  ngOnInit(): void {
    this.service.getNews().subscribe((data) => {
      for (let [key, value] of Object.entries(data)) {
        this.listNews = value[3].stories;
      }
    });
  }
}
