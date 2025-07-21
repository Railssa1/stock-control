import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category, CategoryResponse } from 'src/models/interfaces/category';
import { CreateProductRequest, EditProductRequest, EventAction, GetAllProductsResponse } from 'src/models/interfaces/products';
import { ProductsService } from 'src/services/products/products.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductsDataTransferService } from 'src/app/shared/products/products-data-transfer.service';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';
import { ProductEvent } from 'src/models/enums/products';

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
    amount: [0, Validators.required],
    category_id: ['', Validators.required]
  });

  categoriesData: Array<CategoryResponse> = [];
  selectedCategories: Array<Category> = [];
  productsData: Array<GetAllProductsResponse> = [];

  productAction!: {
    event: EventAction,
    productsList: Array<GetAllProductsResponse>
  }

  addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  renderDropdown = false;

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

    if (this.productAction.event.action === this.saleProductAction) {
      this.getProductsData();
    }

    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories() {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.categoriesData = resp;

        if (this.productAction.event.action === this.editProductAction && this.productAction.productsList) {
          this.getProductsSelected(this.productAction.event.id as string);
        }
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
    if (this.editProductForm.valid) {
      const request: EditProductRequest = {
        product_id: this.productAction.event.id as string,
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string
      }

      this.productService.editProduct(request).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.messageHandlerService.handlerMessage(MessageStatus.Success, 'Produto editado com sucesso.');
          this.ref.close();
        },
        error: () => {
          this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Error ao editar produto.');
          this.ref.close();
        }
      });
    }
  }

  getProductsSelected(productId: string) {
    const product = this.productAction.productsList.find(
      (product) => product.id === productId
    );

    if (product) {
      this.editProductForm.setValue({
        name: product?.name,
        price: product?.price,
        description: product?.description,
        amount: product?.amount,
        category_id: product.category.id
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
