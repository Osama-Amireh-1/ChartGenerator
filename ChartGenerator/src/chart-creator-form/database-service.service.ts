import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseServiceService {

  constructor(private http: HttpClient) { }

  getTable(URL: string) {

    return this.http.get<string[]>(URL)
  }
  getColumns(URL: string) {

    return this.http.get<string[]>(URL)
  }
  getData(url: string, params: HttpParams): Observable<any> {
    return this.http.get(url, { params });
  }
}
