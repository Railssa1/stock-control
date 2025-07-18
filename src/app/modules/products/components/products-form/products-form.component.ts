import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category, CategoryResponse } from 'src/models/interfaces/category';
import { CreateProductRequest, EventAction, GetAllProductsResponse } from 'src/models/interfaces/products';
import { ProductsService } from 'src/services/products/products.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  });

  editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required]
  });

  categoriesData: Array<CategoryResponse> = [];
  selectedCategories: Array<Category> = [];
  productsData: Array<GetAllProductsResponse> = [];

  productAction!: {
    event: EventAction,
    productsData: Array<GetAllProductsResponse>
  }


  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private messageHandlerService: MessageHandlerService,
    private router: Router,
    private productService: ProductsService,
    private productDtService: ProductsDataTransferService,
    public ref: DynamicDialogRef,
    public refConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.productAction = this.refConfig.data;
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.categoriesData = resp;
      }
    });
  }

  handlerSubmitAddProduct(): void {
    if (this.addProductForm.value) {
      const request: CreateProductRequest = this.addProductForm.value as CreateProductRequest;

      this.productService.createProduct(request).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.messageHandlerService.handlerMessage(MessageStatus.Success, 'Produto criado com sucesso!');
          this.ref.close();
        },
        error: (err) => {
          console.log(err);
          this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Falha ao criar produto. Tente novamente!');
          this.ref.close();
        }
      });
    }
  }

  handlerSubmitEditForm(): void {
    if (this.editProductForm.value) {

    }
  }

  getProductsSelected(productId: string) {
    const product = this.productAction.productsData.find(
      (product) => product.id === productId
    );

    if (product) {
      this.editProductForm.setValue({
        name: product?.name,
        price: product?.price,
        description: product?.description,
        amount: product?.amount
      });
    }
  }

  getProductsData(): void {
    this.productService.getAllProducts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.productsData = resp;
        this.productDtService.setProductsData(this.productsData);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
