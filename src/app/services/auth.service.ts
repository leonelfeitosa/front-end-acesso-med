import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // teste
  // private authUrl = 'http://localhost:3000/auth/login';
  // prod
  private authUrl = 'http://162.243.161.30:3021/auth/login';

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
    return this.http.get('http://162.243.161.30:3021/auth/get', requestOptions);
  }
}
