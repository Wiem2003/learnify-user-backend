import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  standalone: false,
})
export class PaymentComponent {
  order = {
    item: 'French B1 Course - Full Access',
    amount: 89,
    currency: 'USD',
  };

  form = {
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  };

  isProcessing = false;
  isSuccess = false;

  pay(): void {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.isSuccess = true;
    }, 1500);
  }
}
