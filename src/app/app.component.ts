import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CaseRowComponent } from './case-row/case-row.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { APIService } from './api.service';
import { SearchBarComponent } from "./search-bar/search-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, CaseRowComponent, TableHeaderComponent, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private apiService = inject(APIService);
  trackingData: any;
  searchData =  signal<string>('');

  ngOnInit(): void {
    // Define a sample tracking number for fetching data

    const trackingNumbers = '215149370230';
    // Make a call to the API to get tracking details for the given tracking number

    this.apiService.getTrackingDetails(trackingNumbers).subscribe({
      next: (response) => {
        // Handle successful response
        this.trackingData = response;
        if (this.trackingData && this.trackingData.data && this.trackingData.data.length > 0) {
          const originInfo = this.trackingData.data[0].origin_info;
          const milestoneDates = originInfo ? originInfo.milestone_date : {};

          // Helper function to format date
          const formatDate = (dateString: string | null) => {
            if (dateString) {
              const date = new Date(dateString);
              return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
            }
            return null;
          };

          // Extracting and formatting specific dates
          const deliveryDate = formatDate(milestoneDates.delivery_date);
          const outForDeliveryDate = formatDate(milestoneDates.outfordelivery_date);
          const pickupDate = formatDate(milestoneDates.pickup_date);
          const infoReceivedDate = formatDate(milestoneDates.inforeceived_date);

          console.log('Delivery Date:', deliveryDate);
          console.log('Out for Delivery Date:', outForDeliveryDate);
          console.log('Pickup Date:', pickupDate);
          console.log('Info Received Date:', infoReceivedDate);
        } else {
          console.log('No tracking data available.');
        }

      },
      error: (error) => {
        // Handle error
        console.error('API call error:', error.message);
      }
    });

    /* this.apiService.postTracking().subscribe({
      next: (response) => {
        // Handle the successful response here
        console.log('API response:', response);
        // Example: Use the response to update component state or other actions
      },
      error: (error) => {
        // Handle the error here
        console.error('API call error:', error);
      }
    }); */
  }

  handleSearchData(datainput: string){
    this.searchData.set(datainput);
  }
}
