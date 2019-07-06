import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgenteService {

  private agentesUrl = 'http://localhost:3000/agentes';

  constructor(private http: HttpClient,
    ) { }

  public getAgentes(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Token': token
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    }
    return this.http.get<any[]>(this.agentesUrl, requestOptions);
  }

  public addAgente(agente: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Token': token
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    }
    return this.http.post<any>(this.agentesUrl, agente, requestOptions);
  }
}
