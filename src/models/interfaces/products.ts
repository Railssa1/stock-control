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
