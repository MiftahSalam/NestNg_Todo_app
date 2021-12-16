import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../models/task.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'api/task';

  constructor(private readonly http: HttpClient) {}

  create(todoId: string, task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${this.baseUrl}/todo/${todoId}`, task, httpOptions)
      .pipe(catchError(this.handleError));
  }
  findAll(todoId: string): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.baseUrl}/todo/${todoId}`, httpOptions)
      .pipe(
        map((results: Task[]) => results),
        catchError(this.handleError)
      );
  }
  deleteTask(id: string): Observable<{}> {
    const url = `${this.baseUrl}/${id}`;

    return this.http
      .delete(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured: ', error.error.message);
    } else {
      console.log(
        `Backend returned error code ${error.status}, body was ${error.status}`
      );
    }

    return throwError(() => 'Something bad happened. Please try again');
  }
}
