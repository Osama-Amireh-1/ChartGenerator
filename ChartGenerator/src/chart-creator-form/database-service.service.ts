import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
