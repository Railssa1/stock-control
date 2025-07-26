import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/models/enums/categories';
import { CategoryResponse, DeleteCategoryAction, EditCategoryAction } from 'src/models/interfaces/category';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {
  @Input() categories: Array<CategoryResponse> = [];
  @Output() categoryEvent = new EventEmitter<EditCategoryAction>();
  @Output() deleteEvent = new EventEmitter<DeleteCategoryAction>();

  categorySelected!: CategoryResponse;

  addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  handlerDeleteCategory(categoryName: string, category_id: string) {
    this.deleteEvent.emit({ category_id, categoryName });
  }

  handlerCategoryEvent(action: string, id?:string, categoryName?:string): void {
    this.categoryEvent.emit({ action, id, categoryName });
  }
}
