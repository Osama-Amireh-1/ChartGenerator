import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  getTables(url: string, TableType: string, token: string): Observable<any> {
    const params = new HttpParams().set('tableType', TableType);
    return this.http.get<any>(url, { params });
  }

  getColumns(URL: string, TableName: string, Token: string): Observable<any> {
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams().set('tableName', TableName);

    return this.http.get<any>(URL, { params })
  }
  //}
  postData(url: string, body: any, token: string): Observable<any> {
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(url, body );
  }

}
