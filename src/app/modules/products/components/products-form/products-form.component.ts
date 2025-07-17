import { MessageService } from 'primeng/api';
import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category, CategoryResponse } from 'src/models/interfaces/category';

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
    categoryId: ['', Validators.required],
    amount: [0, Validators.required]
  });

  categoriesData: Array<CategoryResponse> = [];
  selectedCategories: Array<Category> = [];

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router
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

  handlerSubmitAddProduct(): void{}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
