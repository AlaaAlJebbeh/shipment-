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

/**
 * Defines the TimeLineComponent with a selector, imports, template, and style.
 */

@Component({
  selector: 'app-time-line',
  standalone: true,
  imports: [],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.css',
})
export class TimeLineComponent implements OnInit {
  /**
   * Properties for storing date and tracking information.
   */
  shippingDate: string | null = '';
  inTransitDate: string | null = '';
  outForDeliveryDate: string | null = '';
  deliveredDate: string | null = '';
  trackingNumber = input<string>('215149283351');

  /**
   * Signal properties for tracking status.
   */

  status = signal<
    'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'
  >('shipping');
  statusOut = output<
    'shipping' | 'intransit' | 'outfordelivery' | 'delivered' | 'notfound'
  >();

  /**
   * Injects the API service.
   */

  private apiService = inject(APIService);
  trackingData: any;

  /**
   * Subscription and interval for refreshing data.
   */

  private subscription: Subscription = new Subscription();
  private refreshInterval: number = 300000; // 5 seconds for testing

  searchData = signal<string>('');

  /**
   * Initializes component and sets up interval for data refresh.
   */

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

  /**
   * Cleans up subscription on component destruction.
   */

  ngOnDestroy() {
    // Unsubscribe from the interval to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Fetches tracking details from the API.
   * Handle successful response
   * get the originInfo array
   * set milestoneDates if origin info exist
   * Extract deliveredDate, outForDeliveryDate, shippingDate from the milestoneDates
   * Using the formatDate function
   * Extract inTransitDate through calling another function getInTransitDate
   * since the inTransitDate info doesn't exist in the milestonDates
   * Handling the case of dhl tracking number 10 digits
   * get the out for delivery date from another function getOutForDeliveryDateFromTrackInfo
   * since the outForDeliveryDate info doesn't exist in the milestonDates in the dhl requests
   * calling the updateStatus function
   */

  fetchTrackingDetails() {
    console.log('updated 5 min');

    this.apiService.getTrackingDetails(this.trackingNumber()).subscribe({
      next: (response) => {
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

  /**
   * Formats a date string into a specific format (DD/MM/YYYY).
   *
   * dateString - The date string to be formatted.
   * returns The formatted date string or null if the input is null.
   */

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

  /**
   * Extracts and formats the in-transit date from the tracking information.
   *
   * trackinfo - The tracking information array.
   * return The formatted in-transit date or null if not available.
   */

  getInTransitDate(trackinfo: any[]): string | null {
    if (trackinfo && trackinfo.length > 1) {
      // Get the second-to-last object in the array
      const secondToLastCheckpoint = trackinfo[trackinfo.length - 2];
      console.log('check transit function');
      console.log(secondToLastCheckpoint);
      return this.formatDate(secondToLastCheckpoint.checkpoint_date);
    }
    return null;
  }

  /**
   * Extracts and formats the out-for-delivery date from the tracking information based on the destination country.
   *
   * trackinfo - The tracking information array.
   * destinationCountry - The ISO2 code of the destination country.
   * get the first object from the end where country_iso2 === destinationCountry
   * returns The formatted out-for-delivery date or null if not available.
   */

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

  /**
   * Updates the status of the shipment based on the available dates.
   * Sets the status to 'delivered', 'outfordelivery', 'intransit', 'shipping', or 'notfound' accordingly.
   */

  updateStatus(): void {
    if (this.deliveredDate) {
      this.status.set('delivered');
    } else if (this.outForDeliveryDate) {
      this.status.set('outfordelivery');
    } else if (this.inTransitDate) {
      this.status.set('intransit');
    } else if (this.shippingDate) {
      this.status.set('shipping');
    } else {
      this.status.set('notfound');
    }
  }

  handleSearchData(datainput: string) {
    this.searchData.set(datainput);
  }
}
