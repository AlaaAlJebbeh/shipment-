import { Component, inject, input, OnInit } from '@angular/core';
import { APIService } from '../api.service';

@Component({
  selector: 'app-time-line',
  standalone: true,
  imports: [],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.css'
})
export class TimeLineComponent implements OnInit{

  shippingDate: string | null = '31/07/2024';
  inTransitDate: string | null= '01/08/2024';
  outForDeliveryDate: string | null= '03/08/2024';
  deliveredDate: string | null = '05/08/2024';
  trackingNumber = input<string>('215149283351');


  status = input<'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'>();

  private apiService = inject(APIService);
  trackingData: any;

  ngOnInit(){
    console.log("child" + this.status);

    this.apiService.getTrackingDetails(this.trackingNumber()).subscribe({
      next: (response) => {
        // Handle successful response
        this.trackingData = response;
        if (this.trackingData && this.trackingData.data && this.trackingData.data.length > 0) {
          const originInfo = this.trackingData.data[0].origin_info;
          const milestoneDates = originInfo ? originInfo.milestone_date : {};

          // Helper function to format date
          const formatDate = (dateString: string | null): string | null => {
            if (dateString) {
              const date = new Date(dateString);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            }
            return null;
          };

          // Extracting and formatting specific dates
          this.deliveredDate = formatDate(milestoneDates.delivery_date);
          this.outForDeliveryDate = formatDate(milestoneDates.outfordelivery_date);
          this.shippingDate = formatDate(milestoneDates.pickup_date);
          this.inTransitDate = formatDate(milestoneDates.inforeceived_date);

          console.log('Delivery Date:', this.deliveredDate);
          console.log('Out for Delivery Date:', this.outForDeliveryDate );
          console.log('Pickup Date:', this.shippingDate );
          console.log('Info Received Date:', this.inTransitDate);
        } else {
          console.log('No tracking data available.');
        }

      },
      error: (error) => {
        // Handle error
        console.error('API call error:', error.message);
      }
    });
  }

}
