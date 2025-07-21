import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { CategoryResponse } from 'src/models/interfaces/category';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.css'],
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  categoriesData: CategoryResponse[] = [];

  constructor(
    private categoryService: CategoryService,
    private messageHandlerService: MessageHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllCateogories();
  }

  getAllCateogories() {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resp) => {
        this.categoriesData = resp;
      },
      error: () => {
        this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Erro ao carregar categorias');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
