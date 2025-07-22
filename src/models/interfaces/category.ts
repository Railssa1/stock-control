export interface CategoryResponse {
  id: string;
  name: string;
}

export interface Category {
  name: string;
  code: string;
}

export interface EditCategoryAction {
  action: string;
  id: string;
  categoryName: string;
}

export interface DeleteCategoryAction {
  category_id: string;
  categoryName: string;
}
