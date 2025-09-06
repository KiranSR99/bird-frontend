import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Bird {
  private apiUrl = 'http://localhost:5000/predict';

  constructor(private http: HttpClient) { }

  libraryModelPredict(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/bird`, formData);
  }

  mobileNetPredict(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/mobilenet`, formData);
  }
}
