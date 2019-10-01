import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private comprasUrl = 'http://localhost:3000/compras';

  constructor(private http: HttpClient) { }

  private getToken() {
    const token =  localStorage.getItem('token');
    const headers = {
      'Token': token
    };
    const requestOptions = {
      headers: new HttpHeaders(headers)
    }
    return requestOptions;
  }

  public getHistorico(clienteId: string): Observable<any> {
    return this.http.get<any>(`${this.comprasUrl}/?cliente=${clienteId}`, this.getToken());
  }
}
