import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseAPIUrl = 'https://jsonplaceholder.typicode.com/';
  getUsers = this.baseAPIUrl + 'users';
  constructor(private http: HttpClient) {}
  getUsersList(): Observable<any> {
    return this.http.get<any>(this.getUsers);
  }
  getTasksList(userId: string): Observable<any> {
    return this.http.get<any>(this.getUsers + '/' + userId + '/todos');
  }
}
