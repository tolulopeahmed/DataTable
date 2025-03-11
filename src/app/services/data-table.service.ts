import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';

interface Post {
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your API

  constructor(private http: HttpClient) {}

  getData(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap((data) => console.log('Fetched data:', data)), // Log response for debugging
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Failed to fetch data'));
      })
    );
  }
}
