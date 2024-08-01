import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { APIService } from '../api.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-time-line',
  standalone: true,
  imports: [],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.css',
})
export class TimeLineComponent implements OnInit {
  shippingDate: string | null = '';
  inTransitDate: string | null = '';
  outForDeliveryDate: string | null = '';
  deliveredDate: string | null = '';
  trackingNumber = input<string>('215149283351');

  status = signal<
    'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'
  >('shipping');
  statusOut = output<
    'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'
  >();

  private apiService = inject(APIService);
  trackingData: any;

  private subscription: Subscription = new Subscription();
  private refreshInterval: number = 300000; // 5 seconds for testing

  searchData = signal<string>('');


  ngOnInit() {
    this.fetchTrackingDetails();

    // Set interval to call fetchTrackingDetails every 5 seconds
    const intervalSubscription = interval(this.refreshInterval).subscribe(
      () => {
        this.fetchTrackingDetails();
      }
    );

    this.subscription.add(intervalSubscription);
  }

  ngOnDestroy() {
    // Unsubscribe from the interval to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchTrackingDetails() {
    console.log('updated 5 min');

    this.apiService.getTrackingDetails(this.trackingNumber()).subscribe({
      next: (response) => {
        // Handle successful response
        this.trackingData = response;
        if (
          this.trackingData &&
          this.trackingData.data &&
          this.trackingData.data.length > 0
        ) {
          const originInfo = this.trackingData.data[0].origin_info;
          const milestoneDates = originInfo ? originInfo.milestone_date : {};

          // Extracting and formatting specific dates
          this.deliveredDate = this.formatDate(milestoneDates.delivery_date);
          this.outForDeliveryDate = this.formatDate(
            milestoneDates.outfordelivery_date
          );
          this.shippingDate = this.formatDate(milestoneDates.pickup_date);
          this.inTransitDate = this.getInTransitDate(originInfo.trackinfo);

          if (this.trackingNumber().length === 10) {
            this.outForDeliveryDate = this.getOutForDeliveryDateFromTrackInfo(
              originInfo.trackinfo,
              this.trackingData.data[0].destination_country
            );
          }

          console.log('Delivery Date:', this.deliveredDate);
          console.log('Out for Delivery Date:', this.outForDeliveryDate);
          console.log('Pickup Date:', this.shippingDate);
          console.log('Info Received Date:', this.inTransitDate);

          this.updateStatus();
          console.log(
            'the status in time line after update is' + this.status()
          );
          this.statusOut.emit(this.status());
        } else {
          console.log('No tracking data available.');
        }
      },
      error: (error) => {
        // Handle error
        console.error('API call error:', error.message);
      },
    });
  }

  // Helper function to format date
  formatDate = (dateString: string | null): string | null => {
    if (dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return null;
  };

  getInTransitDate(trackinfo: any[]): string | null {
    if (trackinfo && trackinfo.length > 1) {
      // Get the second-to-last object in the array
      const secondToLastCheckpoint = trackinfo[trackinfo.length - 2];
      return this.formatDate(secondToLastCheckpoint.checkpoint_date);
    }
    return null;
  }

  getOutForDeliveryDateFromTrackInfo(
    trackinfo: any[],
    destinationCountry: string
  ): string | null {
    for (let i = trackinfo.length - 1; i >= 0; i--) {
      const checkpoint = trackinfo[i];
      if (checkpoint.country_iso2 === destinationCountry) {
        return this.formatDate(checkpoint.checkpoint_date);
      }
    }
    return null;
  }

  updateStatus(): void {
    if (this.deliveredDate && this.deliveredDate.trim() !== '          ') {
      this.status.set('delivered');
    } else if (
      this.outForDeliveryDate &&
      this.outForDeliveryDate.trim() !== '          '
    ) {
      this.status.set('outfordelivery');
    } else if (
      this.inTransitDate &&
      this.inTransitDate.trim() !== '          '
    ) {
      this.status.set('intransit');
    } else {
      this.status.set('shipping');
    }
  }

  handleSearchData(datainput: string) {
    this.searchData.set(datainput);
  }

}
