import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Data } from './table/data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private Apiurl ='https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  getData():Observable<Data[]> {
    return this.http.get<Data[]>(this.Apiurl).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error occured', error.message);
    return throwError('Something went wrong; please try again later.');
}

}