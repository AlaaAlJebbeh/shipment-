/* import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiKey = 'xajfxz4h-gd9n-wzav-pklx-fxsyqyfw3u5l';
  private apiUrl = 'https://api.trackingmore.com/v4/trackings/create';
  private response = signal<any | string>('');

  private httpClient = inject(HttpClient);

  postTracking(){
    return this.postRequest(this.apiUrl).pipe(tap({
        next: (response) => this.response.set(response),

    }))

  }

   private postRequest(url: string) {
    const headers = new HttpHeaders({
        "Tracking-Api-Key": this.apiKey,  // Ensure correct header key
        "Content-Type": "application/json",
      });
  
      const body = {
        tracking_number: '215147006478',
        courier_code: 'smsa-express',
      };
  
      console.log('Headers:', headers);
      console.log('Body:', body);

      return this.httpClient.post(url, body, { headers }).pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => new Error('Something went wrong'));
        })
      );


    }
}
 */