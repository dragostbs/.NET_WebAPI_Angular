import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isTradeLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoadingStatus(status: boolean) {
    this.isLoading.next(status);
  }

  setTradeLoading(status: boolean) {
    this.isTradeLoading.next(status);
  }

  startLoading() {
    this.setLoadingStatus(true);
  }

  startTradeLoading() {
    this.setTradeLoading(true);
  }

  stopLoading() {
    this.setLoadingStatus(false);
  }

  stopTradeLoading() {
    this.setTradeLoading(false);
  }

  setLoadingEffect(timeout: number) {
    this.startLoading();

    setTimeout(() => {
      this.stopLoading();
    }, timeout);
  }

  setTradeLoadingEffect(timeout: number) {
    this.startTradeLoading();

    setTimeout(() => {
      this.stopTradeLoading();
    }, timeout);
  }
}
