import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "./CartContext";
import type { Product } from "../types/product";

const product: Product = {
  id: 1,
  name: "Classic Black T-Shirt",
  description: "A simple tee",
  price: 19.99,
  category: "T-Shirts",
  imageUrl: "",
  stock: 10,
  availableSizes: ["S", "M", "L"],
  availableColors: ["Black"],
  createdAt: new Date().toISOString(),
};

function TestHarness() {
  const { items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal.toFixed(2)}</div>
      <div data-testid="line-count">{items.length}</div>
      <button onClick={() => addItem(product, 1, "M", "Black")}>add-m-black</button>
      <button onClick={() => addItem(product, 2, "M", "Black")}>add-2-m-black</button>
      <button onClick={() => addItem(product, 1, "L", "Black")}>add-l-black</button>
      <button onClick={() => updateQuantity(product.id, "M", "Black", 5)}>set-qty-5</button>
      <button onClick={() => removeItem(product.id, "M", "Black")}>remove-m-black</button>
      <button onClick={clearCart}>clear</button>
    </div>
  );
}

function renderHarness() {
  return render(
    <CartProvider>
      <TestHarness />
    </CartProvider>,
  );
}

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty", () => {
    renderHarness();
    expect(screen.getByTestId("item-count")).toHaveTextContent("0");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("0.00");
  });

  it("adds an item and computes subtotal", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));

    expect(screen.getByTestId("item-count")).toHaveTextContent("1");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("19.99");
  });

  it("merges quantity for the same product/size/color line", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));
    await user.click(screen.getByText("add-2-m-black"));

    expect(screen.getByTestId("line-count")).toHaveTextContent("1");
    expect(screen.getByTestId("item-count")).toHaveTextContent("3");
    expect(screen.getByTestId("subtotal")).toHaveTextContent((19.99 * 3).toFixed(2));
  });

  it("keeps different size/color combinations as separate lines", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));
    await user.click(screen.getByText("add-l-black"));

    expect(screen.getByTestId("line-count")).toHaveTextContent("2");
    expect(screen.getByTestId("item-count")).toHaveTextContent("2");
  });

  it("updates quantity for a specific line", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));
    await user.click(screen.getByText("set-qty-5"));

    expect(screen.getByTestId("item-count")).toHaveTextContent("5");
  });

  it("removes a line", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));
    await user.click(screen.getByText("remove-m-black"));

    expect(screen.getByTestId("line-count")).toHaveTextContent("0");
    expect(screen.getByTestId("item-count")).toHaveTextContent("0");
  });

  it("clears the whole cart", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));
    await user.click(screen.getByText("add-l-black"));
    await user.click(screen.getByText("clear"));

    expect(screen.getByTestId("line-count")).toHaveTextContent("0");
  });

  it("persists the cart to localStorage", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-m-black"));

    const stored = JSON.parse(localStorage.getItem("clothing-store-cart") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe(1);
    expect(stored[0].quantity).toBe(1);
  });
});
