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
  isLoading = false; 
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
  // Search terms
  private searchTermSubject = new BehaviorSubject<string>('');
  // paginations
  private pageSubject = new BehaviorSubject<{pageIndex:number, pageSize:number}>({pageIndex:this.pageIndex, pageSize:this.pageSize})

 constructor(private Api: ApiService ) {}

ngOnInit(): void {
  this.filteredPost$ = this.Api.getData().pipe( 
    switchMap(response => {
      console.log('Data fetched successfully:', response);
      this.post = response;
      return this.searchResult$
    })
  );
}

// Search Functions & Paginations

get searchResult$(): Observable<Data[]> {
  return this.searchTermSubject.asObservable().pipe(
    switchMap(term => {
      return this.pageSubject.asObservable().pipe(
        switchMap(({ pageIndex, pageSize}) => {
          let filteredPosts = this.post;
          if (term) {
            filteredPosts = filteredPosts.filter(post => {
              if (typeof post.category === 'string'){
                return post.title.toLowerCase().includes(term.toLowerCase()) ||
                post.category.toLowerCase().includes(term.toLowerCase());
              } else {
                console.warn("Unexpected data type for post.category");
                return false;
              }
            })
          }
          
          this.filteredPostLength = filteredPosts.length;
          console.log(this.filteredPostLength);
          const startIndex = pageIndex * pageSize;
          const endIndex = startIndex + pageSize;
          console.log(endIndex, startIndex);
          return of(filteredPosts.slice(startIndex, endIndex));
          })
      );
    })
  );
}


previousPage(){
  if(this.pageIndex > 0) {
    this.pageIndex--;
    this.pageSubject.next({ pageIndex: this.pageIndex, pageSize: this.pageSize});
  }
}

nextPage() {
  if (this.pageIndex < Math.ceil(this.filteredPostLength / this.pageSize) - 1) {
    this.pageIndex++;
    this.pageSubject.next({ pageIndex: this.pageIndex, pageSize: this.pageSize});
  }
}

onSearchTermChanged(): void {
  this.pageIndex = 0;
  this.searchTermSubject.next(this.searchTerms); // Emit new search term
  this.pageSubject.next({ pageIndex: this.pageIndex, pageSize: this.pageSize});
}

get totalPages():number {
  return  Math.ceil(this.filteredPostLength / this.pageSize)
}

}
