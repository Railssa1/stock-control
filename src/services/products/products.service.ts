import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { GetAllProductsResponse } from 'src/models/interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  private urlApi = environments.apiUrl;
  private JWT_TOKEN = this.cookie.get("JWT_TOKEN");

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  };

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http.get<Array<GetAllProductsResponse>>(`${this.urlApi}/products`, this.httpOptions)
      .pipe(
        map((product) => product.filter((data) => data.amount > 0))
      )
  }

}
