import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  setLoadingStatus(status: boolean) {
    this.isLoading.next(status);
  }

  startLoading() {
    this.setLoadingStatus(true);
  }

  stopLoading() {
    this.setLoadingStatus(false);
  }

  setLoadingEffect(timeout: number) {
    this.startLoading();

    setTimeout(() => {
      this.stopLoading();
    }, timeout);
  }
}
