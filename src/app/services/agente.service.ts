import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgenteService {
  //teste
  // private agentesUrl = 'http://localhost:3021/agentes';
  // producao
  private agentesUrl = 'http://162.243.161.30:3021/agentes';

  constructor(private http: HttpClient,
    ) { }
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

  public getAgentes(): Observable<any> {

    return this.http.get<any>(this.agentesUrl, this.getToken());
  }

  public getAgentesAtivos(): Observable<any> {
    return this.http.get<any>(`${this.agentesUrl}/?situacao=ativo`, this.getToken());
  }

  public getAgentesInativos(): Observable<any> {
    return this.http.get<any>(`${this.agentesUrl}/?situacao=inativo`, this.getToken());
  }

  public getAgente(agenteId: any): Observable<any> {
    return this.http.get<any>(`${this.agentesUrl}/${agenteId}`, this.getToken());
  }


  public addAgente(agente: any): Observable<any> {
    return this.http.post<any>(this.agentesUrl, agente, this.getToken());
  }
  public updateAgente(agenteID: any, agente: any): Observable<any> {
    return this.http.put<any>(`${this.agentesUrl}/${agenteID}`, agente, this.getToken());
  }

  public apagarAgente(agenteId: any): Observable<any> {
    return this.http.delete<any>(`${this.agentesUrl}/${agenteId}`, this.getToken());
  }
}
