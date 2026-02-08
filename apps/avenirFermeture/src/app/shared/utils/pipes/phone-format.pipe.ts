import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  private readonly phoneUtil = PhoneNumberUtil.getInstance();

  transform(phoneNumber: string | null | undefined): string {
    if (phoneNumber == null || phoneNumber.trim() === '') {
      return '';
    }

    try {
      const number = this.phoneUtil.parseAndKeepRawInput(phoneNumber, 'FR');
      if (this.phoneUtil.isValidNumber(number)) {
        return this.phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
      }
      return phoneNumber;
    } catch {
      return phoneNumber;
    }
  }
}
