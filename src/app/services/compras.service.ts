import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  // teste
  // private comprasUrl = 'http://localhost:3000/compras';
  // prod
  private comprasUrl = 'http://162.243.161.30:3021/compras';
  

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

  public getCompras(): Observable<any> {
    return this.http.get<any>(`${this.comprasUrl}/?clinica=true`, this.getToken());
  }
}
