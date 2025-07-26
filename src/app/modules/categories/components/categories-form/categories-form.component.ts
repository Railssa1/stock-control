import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { CategoryEvent } from 'src/models/enums/categories';
import { CategoryAction, CategoryRequest } from 'src/models/interfaces/category';
import { CategoryService } from 'src/services/category/category.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  categoryAction!: CategoryAction;

  categoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  });

  constructor(
    public ref: DynamicDialogRef,
    public refConfing: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private messageHandlerService: MessageHandlerService
  ){}

  ngOnInit(): void {
  }

  handlerSubmitAddForm(): void {
    if (this.categoryForm.valid) {
      const request: CategoryRequest = {
        name: this.categoryForm.value.name as string
      };

      this.categoryService.createCategory(request).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.categoryForm.reset();
          this.messageHandlerService.handlerMessage(MessageStatus.Success, 'Categoria criada com sucesso');
          this.ref.close();
        },
        error: () => {
          this.categoryForm.reset();
          this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Categoria criada com sucesso');
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
