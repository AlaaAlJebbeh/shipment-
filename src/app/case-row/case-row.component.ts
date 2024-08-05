import { Component, inject, input, output, signal } from '@angular/core';
import { TimeLineComponent } from '../time-line/time-line.component';

/**
 * Defines the CaseRowComponent with a selector, imports, template, and style.
 */

@Component({
  selector: 'app-case-row',
  standalone: true,
  imports: [TimeLineComponent],
  templateUrl: './case-row.component.html',
  styleUrl: './case-row.component.css',
})
export class CaseRowComponent {
    /**
   * inputs that stores the 
   * case number
   * patient's name
   * tracking number
   * status of the case
   */
  caseNumber = input<string>('129565926');
  patientName = input<string>('Alaa Al Jebbeh');
  trackingNumber = input<string>('215149616982');
  status =  signal<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>('shipping');
  /**
   * Emits the tracking number.
   */
  trackingNoOUt = output<string>();

  /**
   * Handles status changes and logs the new status.
   */
  handleStatusChange(status: 'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound') {
    this.status.set(status);
    console.log('Status received from child:', status);
  }

}
