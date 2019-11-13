import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  // teste
  // private clientesUrl = 'http://localhost:3021/clientes';
  // prod
  private clientesUrl = 'http://162.243.161.30:3021/clientes';
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

  public getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.clientesUrl, this.getToken());
  }

  public getCliente(clienteId): Observable<any> {
    return this.http.get<any>(`${this.clientesUrl}/${clienteId}`, this.getToken());
  }

  public updateCliente(clienteId, cliente): Observable<any> {
    return this.http.put<any>(`${this.clientesUrl}/${clienteId}`, cliente, this.getToken());
  }
}
