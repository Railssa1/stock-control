import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
import { DeleteAction, EventAction, GetAllProductsResponse } from 'src/models/interfaces/products';
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  handlerDeleteProduct(event: DeleteAction): void{
    this.confirmationService.confirm({
      message: `Deseja excluir o produto: ${event.productName}`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteProduct(event.productId)
    });
  }

  deleteProduct(productId: string) {
    this.productsService.deleteProduct(productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto excluido com sucesso',
          life: 2500
        });

        this.loadingProductsByApi();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir produto',
          life: 2500
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
