import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

const inStockProduct: Product = {
  id: 1,
  name: "Classic Black T-Shirt",
  description: "A simple tee",
  price: 19.99,
  category: "T-Shirts",
  imageUrl: "",
  stock: 10,
  availableSizes: ["S", "M", "L"],
  availableColors: ["Black", "White"],
  createdAt: new Date().toISOString(),
};

const outOfStockProduct: Product = { ...inStockProduct, id: 2, name: "Sold Out Hoodie", stock: 0 };

function CartCount() {
  const { itemCount } = useCart();
  return <div data-testid="item-count">{itemCount}</div>;
}

function renderCard(product: Product) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CartCount />
        <ProductCard product={product} />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("ProductCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders name, price, and category", () => {
    renderCard(inStockProduct);
    expect(screen.getByText("Classic Black T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
  });

  it("quick-adds the first size/color to the cart", async () => {
    const user = userEvent.setup();
    renderCard(inStockProduct);

    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(screen.getByTestId("item-count")).toHaveTextContent("1");
  });

  it("shows an out-of-stock tag and disables Add to Cart", () => {
    renderCard(outOfStockProduct);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to Cart" })).toBeDisabled();
  });
});
