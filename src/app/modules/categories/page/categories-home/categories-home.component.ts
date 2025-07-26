import { CategoryService } from './../../../../../services/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { CategoryResponse, DeleteCategoryAction, EditCategoryAction } from 'src/models/interfaces/category';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.css'],
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  categoriesData: CategoryResponse[] = [];
  ref!: DynamicDialogRef;

  constructor(
    private categoryService: CategoryService,
    private messageHandlerService: MessageHandlerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
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

  handlerDeleteCategory(event: DeleteCategoryAction): void {
    this.confirmationService.confirm({
      message: `Confirma a exclusão da categoria: ${event.categoryName}`,
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Não',
      accept: () => this.deleteCategory(event.category_id)
    });
  }

  deleteCategory(category_id: string): void {
    this.categoryService.deleteCategory(category_id).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.getAllCateogories()
      })
    ).subscribe({
      next: () => {
        this.messageHandlerService.handlerMessage(MessageStatus.Success, 'Categoria removida com sucesso.');
      },
      error: () => {
        this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Falha ao remover categorias.');
      }
    });
  }

  handlerCategotyEvent(event: EditCategoryAction): void {
    this.ref = this.dialogService.open(CategoriesFormComponent, {
      header: event.action,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1000,
      maximizable: true,
      data: {
        event: event
      }
    });

    this.ref.onClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.getAllCateogories();
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
