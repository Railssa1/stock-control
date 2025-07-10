import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/models/interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  productsData: Array<GetAllProductsResponse> = [];

  setProductsData(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.productsDataEmitter$.next(products);
      this.getProductsData();
    }
  }

  getProductsData(): Array<GetAllProductsResponse> {
    this.productsDataEmitter$.pipe(
      take(1),
      map(data => data?.filter((product) => product.amount > 0))
    ).subscribe({
      next: (resp) => {
        if (resp) {
          this.productsData = resp;
        }
      }
    });

    return this.productsData;
  }
}
