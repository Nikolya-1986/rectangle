import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Rectangle } from '../intefaces/rectangle';

@Injectable({
  providedIn: 'root'
})
export class RectangleService {

  private BASE_URL = "assets/data-base.json";

  constructor(
    private http: HttpClient,
  ) { }

  public getRectangle(): Observable<Rectangle> {
    return this.http.get<Rectangle>(this.BASE_URL);
  };

  public saveRectangle(rectangle: Rectangle): Observable<Rectangle> {
    return this.http.post<Rectangle>(this.BASE_URL, rectangle);
  };

}
