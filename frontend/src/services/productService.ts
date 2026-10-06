import { api } from "./api";
import type { Product } from "../types/product";

export const productService = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  getByCategory: (category: string) =>
    api.get<Product[]>(`/products/category/${encodeURIComponent(category)}`),
};
