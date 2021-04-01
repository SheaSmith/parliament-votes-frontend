import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Topline } from '../models/statistics/topline';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  public getTopline(): Observable<Topline> {
    return this.http.get<any>(`${environment.base_url}/api/statistics/topline`).pipe(map(t => new Topline(t)));
  }
}
