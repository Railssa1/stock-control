import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { CategoryResponse } from 'src/models/interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlApi = environments.apiUrl;
  private JWT_TOKEN = this.cookie.get("JWT_TOKEN");

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  };

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  getAllCategories(): Observable<Array<CategoryResponse>> {
    return this.http.get<Array<CategoryResponse>>(`${this.urlApi}/categories`, this.httpOptions);
  }

  deleteCategory(category_id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/category/delete`, {
      ...this.httpOptions,
      params: {
        category_id
      }
    });
  }
}
