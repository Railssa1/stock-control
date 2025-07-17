import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
import { DeleteAction, EventAction, GetAllProductsResponse } from 'src/models/interfaces/products';
import { ProductsService } from 'src/services/products/products.service';
import { ProductsFormComponent } from '../../components/products-form/products-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;

  productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,

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
    this.ref = this.dialogService.open(ProductsFormComponent, {
      header: event.action,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: event,
        productsList: this.productsList
      }
    });
    this.ref.onClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.loadingProductsByApi()
    });
  }

  handlerDeleteProduct(event: DeleteAction): void {
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
