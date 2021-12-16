import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Todo } from '../models/todo.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl: string = 'api/todos';

  constructor(private readonly httpService: HttpClient) {}

  create(todo: Todo): Observable<Todo> {
    return this.httpService
      .post<Todo>(this.baseUrl, todo, httpOptions)
      .pipe(catchError(this.handleError));
  }
  findAll(): Observable<Todo[]> {
    return this.httpService.get<Todo[]>(this.baseUrl, httpOptions).pipe(
      map((results: any) => results.todos),
      catchError(this.handleError)
    );
  }
  deleteTodo(id: string): Observable<{}> {
    const url = `${this.baseUrl}/${id}`;

    return this.httpService
      .delete(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured:', error.error.message);
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.status}`
      );
    }

    return throwError(() => `Something bad happened. please try again`);
  }
}
