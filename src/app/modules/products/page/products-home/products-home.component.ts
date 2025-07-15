import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
import { EventAction, GetAllProductsResponse } from 'src/models/interfaces/products';
import { ProductsService } from 'src/services/products/products.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const loadedProduts = this.productsDtService.getProductsData();

    if (loadedProduts.length > 0) {
      this.productsList = loadedProduts;
    } else {
      this.loadingProductsByApi();
    }
  }

  loadingProductsByApi() {
    this.productsService.getAllProducts().pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (resp) => {
          this.productsList = resp;
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao carregar produtos',
            life: 2500
          });
        }
      });
  }

  handlerProductActions(event: EventAction): void {
    console.log("Evento recebido", event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
