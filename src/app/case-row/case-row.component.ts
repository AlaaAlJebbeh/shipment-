import { Component, inject, input, output, signal } from '@angular/core';
import { TimeLineComponent } from '../time-line/time-line.component';
import { APIService } from '../api.service';

@Component({
  selector: 'app-case-row',
  standalone: true,
  imports: [TimeLineComponent],
  templateUrl: './case-row.component.html',
  styleUrl: './case-row.component.css',
})
export class CaseRowComponent {
  caseNumber = input<string>('129565926');
  patientName = input<string>('Alaa Al Jebbeh');
  trackingNumber = input<string>('215149616982');
  status =  signal<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>('shipping');
  trackingNoOUt = output<string>();


/*   get statusShip() {
    //return this.statusIn();
  } */

  handleStatusChange(status: 'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound') {
    this.status.set(status);
    console.log('Status received from child:', status);
    // Further handling in the parent component
  }

}
