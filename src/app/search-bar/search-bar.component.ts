import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchDataOut = output<string>();
  searchForm = new FormGroup({
    searchData: new FormControl<string | any>(''),
  });

  onSubmitSearch() {
    this.searchDataOut.emit(this.searchForm.value.searchData);
    console.log('search submitted '+ this.searchForm.value.searchData );
  }
}
