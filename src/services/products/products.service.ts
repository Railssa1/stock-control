import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { CreateProductRequest, CreateProductResponse, DeleteProductResponse, EditProductRequest, GetAllProductsResponse, SaleProductRequest, SaleProductResponse } from 'src/models/interfaces/products';

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

  deleteProduct(productId: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.urlApi}/product/delete`, {
      ...this.httpOptions, params: {
        product_id: productId
      }
    });
  }

  createProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(`${this.urlApi}/product`, request, this.httpOptions);
  }

  editProduct(request: EditProductRequest): Observable<void> {
    return this.http.put<void>(`${this.urlApi}/product/edit`, request, this.httpOptions);
  }

  saleProdut(request: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(`${this.urlApi}/product/sale`, {
      amount: request.amount
    }, {
      ...this.httpOptions,
      params: {
        product_id: request.product_id
      }
    });
  }
}
