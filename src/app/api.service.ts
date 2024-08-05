import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiKey = 'xajfxz4h-gd9n-wzav-pklx-fxsyqyfw3u5l';
  private apiUrl = 'https://api.trackingmore.com/v4/trackings/create';

  private httpClient = inject(HttpClient);
  /**
   * Sends a POST request to create tracking information.
   * Handle errors from the API call
   * returns An Observable that emits the response from the API.
   * Log client-side errors
   * Log server-side errors
   */

  postTracking(): Observable<any> {
    const trackingNumber = '215149814514';

    console.log(this.apiUrl);
    return this.postRequest(this.apiUrl, trackingNumber).pipe(
      tap((response) => {
        console.log('Response in APIService:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in APIService:', error);
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error(`Server-side error: ${error.status} ${error.message}`);
        }
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  /**
   * Makes a POST request to the specified URL with the given tracking number.
   *
   * param url - The URL to which the request is sent.
   * param trackingNumber - The tracking number to be sent in the request body.
   * Determine the courier code based on the length of the tracking number
   * Send the POST request
   * returns An Observable that emits the response from the API.
   */

  private postRequest(url: string, trackingNumber: string): Observable<any> {
    let courierCode: string = '';
    const headers = new HttpHeaders({
      'Tracking-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    });
    const length = trackingNumber.length;
    if (length === 10) {
      courierCode = 'dhl-global-logistics';
    } else if (length === 12) {
      courierCode = 'smsa-express';
    } else {
      courierCode = 'unknown';
    }

    const body = {
      tracking_number: trackingNumber,
      courier_code: courierCode,
    };

    console.log('Headers:', headers);
    console.log('Body:', body);

    return this.httpClient.post<any>(url, body, { headers });
  }

  /**
   * Fetches tracking details for the given tracking numbers.
   *
   * param trackingNumbers - The tracking numbers to be queried.
   * Construct the URL with the tracking numbers as query parameters
   * Make the GET request
   * returns An Observable that emits the tracking details from the API.
   */

  getTrackingDetails(trackingNumbers: string): Observable<any> {
    const headers = new HttpHeaders({
      'Tracking-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    });

    const url = `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingNumbers}`;

    return this.httpClient.get<any>(url, { headers });
  }
}
