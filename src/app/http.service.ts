import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from "./consts/url";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient) { }

  getStationsList(url: string): Observable<any> {
    return this.http.get<any>(URL + "getstations/?attributes=" + url);
  }
}
