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

  setTradeLoadingStatus(status: boolean) {
    this.isTradeLoading.next(status);
  }

  startLoadingEffect(timeout: number, setLoadingFn: (status: boolean) => void) {
    setLoadingFn(true);

    setTimeout(() => {
      setLoadingFn(false);
    }, timeout);
  }

  setLoadingEffect(timeout: number) {
    this.startLoadingEffect(timeout, this.setLoadingStatus.bind(this));
  }

  setTradeLoadingEffect(timeout: number) {
    this.startLoadingEffect(timeout, this.setTradeLoadingStatus.bind(this));
  }
}
