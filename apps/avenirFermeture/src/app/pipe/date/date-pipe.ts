import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Date',
  standalone: true, // Angular 20 supporte le standalone pour simplifier l'import
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | number | Date): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  }
}
