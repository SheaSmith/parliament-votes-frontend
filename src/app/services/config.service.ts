import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Config } from '../models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: BehaviorSubject<Config> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  public getConfig(): Observable<Config> {
    if (this.config.value != null) {
      return this.config;
    }

    return this.http.get(`${environment.base_url}/private-api/config`).pipe(map(c => new Config(c)));
  }
}
