import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phoneNumber: string | null | undefined): string {
    const phoneUtil = PhoneNumberUtil.getInstance();

    if (phoneNumber == null || phoneNumber.trim() === '') {
      return '';
    }

    try {
      const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'FR');
      if (phoneUtil.isValidNumber(number)) {
        return phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
      }
      return phoneNumber;
    } catch (e) {
      return phoneNumber;
    }
  }
}
