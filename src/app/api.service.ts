import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiKey = 'xajfxz4h-gd9n-wzav-pklx-fxsyqyfw3u5l';
  private apiUrl = 'https://api.trackingmore.com/v4/trackings/create';

  private httpClient = inject(HttpClient);

  postTracking(): Observable<any> {

    console.log(this.apiUrl);
    return this.postRequest(this.apiUrl).pipe(
      tap(response => {
        // Log the response for debugging
        console.log('Response in APIService:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        // Log more details about the error
        console.error('Error in APIService:', error);
        // Optionally, log the error body or other details
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error(`Server-side error: ${error.status} ${error.message}`);
        }
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  private postRequest(url: string): Observable<any> {
    const headers = new HttpHeaders({
      "Tracking-Api-Key": this.apiKey,  // Ensure correct header key
      "Content-Type": "application/json",
    });

    // Make sure to check the required structure of the request body
    const body = {
      tracking_number: '215149695646',
      courier_code: 'smsa-express',
    };

    console.log('Headers:', headers);
    console.log('Body:', body);

    return this.httpClient.post<any>(url,body, {headers});
  }

  
  getTrackingDetails(trackingNumbers: string): Observable<any> {
    const headers = new HttpHeaders({
      "Tracking-Api-Key": this.apiKey,  // Ensure correct header key
      "Content-Type": "application/json",
    });

    // Construct the URL with the tracking numbers as query parameters
    const url = `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingNumbers}`;

    // Make the GET request
    return this.httpClient.get<any>(url, { headers });
  }
}
