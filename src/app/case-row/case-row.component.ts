import { Component, input, output, signal } from '@angular/core';
import { TimeLineComponent } from '../time-line/time-line.component';

@Component({
  selector: 'app-case-row',
  standalone: true,
  imports: [TimeLineComponent],
  templateUrl: './case-row.component.html',
  styleUrl: './case-row.component.css',
})
export class CaseRowComponent {
  caseNumber = input<String>('129565926');
  patientName = input<String>('Alaa Al Jebbeh');
  trackingNumber = input<String>('215149616982');
  statusIn = input<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>('shipping');

  status =  signal<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>('delivered');

  statusOut = output<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>();

  ngOnInit() {
    this.status.set(this.statusIn());
    this.statusOut.emit(this.status());
    console.log(this.status());
  }

  get statusShip() {
    return this.status;
  }
}
