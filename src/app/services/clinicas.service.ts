import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicasService {
  // teste
  // private clinicasUrl = 'http://localhost:3021/clinicas';
  // prod
  private clinicasUrl = 'http://162.243.161.30:3021/clinicas';
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

  public getClinicas(): Observable<any[]> {
    return this.http.get<any[]>(this.clinicasUrl, this.getToken());
  }

  public getActiveClinicas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.clinicasUrl}/?situacao=ativo`, this.getToken());
  }

  public getInactiveClinicas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.clinicasUrl}/?situacao=inativo`, this.getToken());
  }

  public getClinica(id: any): Observable<any> {
    return this.http.get<any>(`${this.clinicasUrl}/${id}`, this.getToken());
  }

  public addClinica(clinica: any): Observable<any> {
    return this.http.post<any>(this.clinicasUrl, clinica, this.getToken());
  }

  public updateClinica(clinicaId: any, clinica: any): Observable<any> {
    return this.http.put<any>(`${this.clinicasUrl}/${clinicaId}`, clinica, this.getToken());
  }

  public deleteClinica(clinicaId): Observable<any> {
    return this.http.delete<any>(`${this.clinicasUrl}/${clinicaId}`, this.getToken());
  }

  public addProcedimento(clinicaId: any, procedimento: any): Observable<any> {
    return this.http.post<any>(`${this.clinicasUrl}/${clinicaId}/procedimentos`, procedimento, this.getToken());
  }
}
