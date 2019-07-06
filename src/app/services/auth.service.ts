import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:3000/users/login';

  constructor(private http: HttpClient) { }

  public login(credentials: any): Observable<any> {
    return this.http.post<any>(this.authUrl, credentials);
  }

  public checkToken(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = {
      'Token': token
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    }
    return this.http.get('http://localhost:3000/', requestOptions);
  }
}
