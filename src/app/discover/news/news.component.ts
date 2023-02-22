import { Component, OnInit } from '@angular/core';
import { News } from 'src/app/interfaces/interfaces';
import { DiscoverApiService } from 'src/app/services/discover-api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  listNews: News[] = [];

  constructor(private service: DiscoverApiService) {}

  ngOnInit(): void {
    // Get News
    this.service.getNews().subscribe((data) => {
      let { modules }: any = data;

      for (let value of modules[3].stories) {
        const news: News = {
          title: value.title,
          image: value.thumbnailImage,
          date: value.published,
        };

        this.listNews.push(news);
      }
    });
  }
}
