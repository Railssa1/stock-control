import { Component, Input } from '@angular/core';
import { CategoryResponse } from 'src/models/interfaces/category';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {
  @Input() categories: Array<CategoryResponse> = [];

  categorySelected!: CategoryResponse;
}
