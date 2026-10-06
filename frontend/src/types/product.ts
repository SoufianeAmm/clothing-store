export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  availableSizes: string[];
  availableColors: string[];
  createdAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt">;
