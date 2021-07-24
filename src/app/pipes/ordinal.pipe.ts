import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (isNaN(value) || value < 1) {
      return value;
    } else if (value % 100 == 11 || value % 100 == 12) {
      return `${value}th`;
    } else {
      var lastDigit = value % 10;
      if (lastDigit === 1) {
        return `${value}st`;
      } else if (lastDigit === 2) {
        return `${value}nd`;
      } else if (lastDigit === 3) {
        return `${value}rd`;
      } else if (lastDigit > 3) {
        return `${value}th`;
      }
    }
  }

}
