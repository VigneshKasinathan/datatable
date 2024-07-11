import { Component, OnInit } from '@angular/core';
import { Data } from './data';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject, switchMap, of  } from 'rxjs';
import { faSearch, faArrowLeft, faArrowRight, faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  faSearch = faSearch
  faArrowLeft = faArrowLeft
  faArrowRight = faArrowRight 
  faArrowUp = faSortUp
  faArrowDown = faSortDown

  isLoading = false; 
  post: Data[] = [];
  filteredPost$: Observable<Data[]> = of([]); 
  searchTerms = '';
  errorMessage = '';
  pageIndex = 0;
  pageSize = 5;
  pageSizes:number[] = [5,10, 15, 20];
  filteredPostLength = 0;

  sortKey = ''; // Keeps track of the current sorting column
  sortDirection = 'asc'; // Default sorting direction
  
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
      this.applySorting();
      return this.searchResult$
    })
  );
}

private applySorting(): void {
  if (this.sortKey) {
    this.post.sort((a, b) => {
      const valueA = this.resolveProperty(a, this.sortKey);
      const valueB = this.resolveProperty(b, this.sortKey);
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
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

          //  Sort logic
          if (this.sortKey) {
            filteredPosts.sort((a, b) => {
              const valueA = this.resolveProperty(a, this.sortKey);
              const valueB = this.resolveProperty(b, this.sortKey);
              if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
              if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
              return 0;
            });
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

onPageSizeChange(event: Event): void {
  const newPageSize = +(event.target as HTMLSelectElement).value;
  this.pageSize = newPageSize;
  this.pageIndex = 0;
  this.pageSubject.next({ pageIndex: this.pageIndex, pageSize: this.pageSize})
}

toggleSort(key: string):void {
  if (this.sortKey === key) {
    this.sortDirection = this.sortDirection === 'asc'? 'desc' : 'asc';
  } else {
    this.sortKey = key;
    this.sortDirection = 'asc';
  }
  this.searchTermSubject.next(this.searchTerms); // Emit new search term
  this.pageSubject.next({ pageIndex: this.pageIndex, pageSize: this.pageSize});
}

resolveProperty(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
}


get totalPages():number {
  return  Math.ceil(this.filteredPostLength / this.pageSize)
}

}
