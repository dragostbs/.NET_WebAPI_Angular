import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalcMaService {
  constructor() {}

  calculateAVG(values: number[]) {
    let sum = values.reduce((sum, value) => {
      return sum + value;
    });
    let avg = sum / values.length;

    return avg;
  }

  calculateMA(values: number[], period: number) {
    let ma = values.map((val: any, index: number, arr: number[]) => {
      if (index < period) {
        val = null;
      } else {
        val = arr.slice(index - period, index);
        val = this.calculateAVG(val);
      }
      return val;
    });
    return ma;
  }

  // Calc the max value
  calculateMax(data: any[]) {
    let max = data.reduce((previous, current) => {
      return current[1] > previous[1] ? current : previous;
    });
    return max;
  }

  // Calc the min value
  calculateMin(data: any[]) {
    let max = data.reduce((previous, current) => {
      return current[1] < previous[1] ? current : previous;
    });
    return max;
  }
}
