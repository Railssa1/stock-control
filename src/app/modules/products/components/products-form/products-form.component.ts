import { MessageService } from 'primeng/api';
import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category, CategoryResponse } from 'src/models/interfaces/category';
import { CreateProductRequest } from 'src/models/interfaces/products';
import { ProductsService } from 'src/services/products/products.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

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

  categoriesData: Array<CategoryResponse> = [];
  selectedCategories: Array<Category> = [];

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductsService,
    public ref: DynamicDialogRef
  ){}

  ngOnInit(): void {
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

  handlerSubmitAddProduct(): void{
    if (this.addProductForm.value) {
      const request: CreateProductRequest = this.addProductForm.value as CreateProductRequest;

      this.productService.createProduct(request).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto criado com sucesso!',
            life: 2500
          });

          this.ref.close();
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar produto. Tente novamente!',
            life: 2500
          });

          this.ref.close();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
