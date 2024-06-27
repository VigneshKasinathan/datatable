import { Component, OnInit } from '@angular/core';
import { Data } from './data';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject, switchMap, of, map } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  post: Data[] = [];
  filteredPost$: Observable<Data[]> = of([]); 
  searchTerms = '';
  errorMessage = '';
  pageIndex = 0;
  pageSize = 5;
  filteredPostLength = 0;
  errorStyle = {
    'color': 'red',
    'font-weight': 'bold',
    'background-color': '#f8d7da',
    'padding': '10px',
    'border': '1px solid red',
    'border-radius': '5px'
  };

  private searchTermSubject = new BehaviorSubject<string>('');

 constructor(private Api: ApiService ) {}
// ngOnInit(): void {
//   this.Api.getData().subscribe({
//     next: (response) =>{
//       this.post = response,
//       this.filteredPost = response
//     }, 
//     error: (err) => this.errorMessage = err
//   });
// }


ngOnInit(): void {
  this.filteredPost$ = this.Api.getData().pipe( 
    switchMap(response => {
      this.post = response;
      return this.searchResult$
    })
  );
}


get searchResult$(): Observable<Data[]> {
  return this.searchTermSubject.asObservable().pipe(
    switchMap(term => {
      if (term) {
        return of(this.post.filter(post => {
          if (typeof post.category === 'string'){
            return post.title.toLowerCase().includes(term.toLowerCase()) ||
            post.category.toLowerCase().includes(term.toLowerCase());
          } else {
            console.warn("Unexpected data type for post.category");
            return [];
          }
        })).pipe(map(data => {
          this.filteredPostLength = data.length;
          console.log(this.filteredPostLength);
          return data.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);  
        }) 
        );
      } else {
        return of(this.post);
      }
    })
  );
}

// onSearchTermChanged(): void{
//   console.log('Search term:', this.searchTerms); 
//   if (this.searchTerms) {
//     this.filteredPost = this.post.filter(post => 
//       post.title.toLowerCase().includes(this.searchTerms.toLowerCase()) ||
//       post.category.toLowerCase().includes(this.searchTerms.toLowerCase())
//     );
//     console.log('Filtered posts:', this.filteredPost);    
//   }else {
//   this.filteredPost = this.post;
// }
// }

previousPage(){
  if(this.pageIndex > 0) {
    this.pageIndex--;
  }
}

nextPage() {
  if (this.pageIndex < Math.ceil(this.filteredPostLength / this.pageSize) - 1) {
    this.pageIndex++;
  }
}

onSearchTermChanged(): void {
  this.searchTermSubject.next(this.searchTerms); // Emit new search term
}

}
