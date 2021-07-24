import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Config } from '../models/config';
import { Meta } from '../models/meta';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  getRecentQuestions(skip: number, voteType: string, config: Config): Observable<Meta<Question>> {
    let params = new HttpParams();
    params = params.set('skip', skip.toString()).set('limit', '20');

    if (voteType != null) {
      params = params.set('voteType', voteType);
    }

    return this.http.get(`${environment.base_url}/api/questions/recent`, {params: params}).pipe(map(m => new Meta(m, m['content'].map(q => new Question(q, config)))));
  }

  getQuestion(questionId: number, config: Config): Observable<Question> {
    return this.http.get(`${environment.base_url}/api/questions/${questionId}`).pipe(map(q => new Question(q, config)));
  }
}
