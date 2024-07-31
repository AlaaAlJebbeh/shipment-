import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-line',
  standalone: true,
  imports: [],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.css'
})
export class TimeLineComponent implements OnInit{

  shippingDate = input<String>('31/07/2024');
  inTransitDate = input<String>('01/08/2024');
  outForDeliveryDate = input<String>('03/08/2024');
  deliveredDate = input<String>('05/08/2024');

  status = input<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>();

  ngOnInit(){
    console.log("child" + this.status);
  }

}
