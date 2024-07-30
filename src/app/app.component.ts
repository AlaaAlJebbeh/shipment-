import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APIService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 

  constructor(private apiService: APIService) { }
  response = this.apiService.postTracking;

  ngOnInit(): void {
    this.apiService.postTracking().subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error fetching data:', error); // Log any error
      }
    );
  }
}
