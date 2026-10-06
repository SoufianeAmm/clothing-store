import { api } from "./api";
import type { OrderInput, OrderResponse } from "../types/order";

export const orderService = {
  create: (order: OrderInput) => api.post<OrderResponse>("/orders", order),
  getByOrderNumber: (orderNumber: string) =>
    api.get<OrderResponse>(`/orders/${encodeURIComponent(orderNumber)}`),
};
