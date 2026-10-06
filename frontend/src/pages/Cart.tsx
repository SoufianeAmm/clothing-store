import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";
import { productPlaceholder } from "../utils/productImage";

const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING = 8;

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container section">
        <h2 style={{ marginBottom: 24 }}>Your Cart</h2>
        <EmptyState message="Your cart is empty." />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-header">
        <h2>Your Cart</h2>
        <button type="button" className="section-link" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={clearCart}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-line" key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}>
              <div className="cart-line-image">
                <img src={productPlaceholder(item.product.name, item.product.category)} alt={item.product.name} />
              </div>
              <div>
                <div className="cart-line-name">{item.product.name}</div>
                <div className="cart-line-meta">
                  Size {item.selectedSize} · {item.selectedColor} · ${item.product.price.toFixed(2)} each
                </div>
                <div className="cart-line-controls">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(q) => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, q)}
                    max={item.product.stock}
                  />
                  <button
                    type="button"
                    className="cart-line-remove"
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-line-totals">${(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="stock-note">
              Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
            </p>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
