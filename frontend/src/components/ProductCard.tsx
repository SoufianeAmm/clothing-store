import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { productPlaceholder } from "../utils/productImage";

const SWATCH_COLORS: Record<string, string> = {
  black: "#17171a",
  white: "#ffffff",
  beige: "#e3d5bd",
  blue: "#3b5c8c",
  navy: "#1f2a44",
  olive: "#5c5b3f",
  grey: "#9a9a9a",
  gray: "#9a9a9a",
};

function swatchColor(name: string) {
  return SWATCH_COLORS[name.toLowerCase()] ?? "#cccccc";
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  function handleQuickAdd() {
    if (outOfStock) return;
    addItem(product, 1, product.availableSizes[0], product.availableColors[0]);
  }

  return (
    <div className="product-card">
      <div className="product-card-image">
        {outOfStock && <span className="out-of-stock-tag">Out of Stock</span>}
        <Link to={`/product/${product.id}`}>
          <img src={productPlaceholder(product.name, product.category)} alt={product.name} loading="lazy" />
        </Link>
        <div className="product-card-overlay">
          <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ background: "#fff" }}>
            View Details
          </Link>
          <button type="button" className="btn btn-primary" onClick={handleQuickAdd} disabled={outOfStock}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-meta">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <div className="swatches">
            {product.availableColors.map((color) => (
              <span
                key={color}
                className="swatch-dot"
                style={{ background: swatchColor(color) }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
