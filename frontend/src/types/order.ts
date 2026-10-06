export interface OrderItemInput {
  productId: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: OrderItemInput[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  selectedSize: string;
  selectedColor: string;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}
