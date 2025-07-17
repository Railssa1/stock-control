export interface GetAllProductsResponse {
  id: string;
  name: string;
  amount: number;
  description: string;
  price: string;
  category: category;
}

interface category {
  id: string;
  name: string;
}

export interface DeleteProductResponse {
  id: string;
  name: string;
  price: string;
  description: string;
  amount: number;
  categoryId: string;
}

export interface EventAction {
  action: string;
  id?: string;
}

export interface DeleteAction {
  productName: string;
  productId: string;
}

export interface CreateProductRequest {
  name: string;
  price: string;
  description: string;
  amount: number;
  category_id: string;
}

export interface CreateProductResponse {
  id: string;
  name: string;
  price: string;
  description: string;
  amount: number;
  category_id: string;
}
