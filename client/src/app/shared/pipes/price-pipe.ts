import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    currencySymbol: string = '£'
  ): string {
    if (value === null || value === undefined) return `${currencySymbol}0.00`;
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num as number)) return `${currencySymbol}0.00`;
    return `${currencySymbol}${(num as number).toFixed(2)}`;
  }
}
