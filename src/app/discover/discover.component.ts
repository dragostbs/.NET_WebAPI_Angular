import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  ngOnInit(): void {
    this.loaderComponent.start();
  }
}
