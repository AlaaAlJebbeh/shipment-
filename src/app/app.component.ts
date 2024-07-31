import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CaseRowComponent } from "./case-row/case-row.component";
import { TableHeaderComponent } from "./table-header/table-header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, CaseRowComponent, TableHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 

/*   constructor(private apiService: APIService) { }
  response = this.apiService.postTracking;

  ngOnInit(): void {
    this.apiService.postTracking().subscribe(
      (response) => {
      },
      (error) => {
        //console.error('Error fetching data:', error); // Log any error
      }
    );
  } */
}
