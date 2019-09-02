import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  private estadosUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  constructor(private http: HttpClient) { }

  public getEstados(): Observable<any[]> {
    return this.http.get<any[]>(this.estadosUrl);
  }

  public getCidades(estadoId): Observable<any[]> {
    return this.http.get<any[]>(`${this.estadosUrl}/${estadoId}/municipios`);
  }
}
