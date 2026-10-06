import { Link, useLocation, useParams } from "react-router-dom";
import type { OrderResponse } from "../types/order";
import { useFetch } from "../hooks/useFetch";
import { orderService } from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { productPlaceholder } from "../utils/productImage";

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const stateOrder = (location.state as { order?: OrderResponse } | null)?.order;

  const { data: fetchedOrder, loading, error } = useFetch(
    () => orderService.getByOrderNumber(orderNumber ?? ""),
    [orderNumber],
    { skip: Boolean(stateOrder) },
  );

  const order = stateOrder ?? fetchedOrder;

  if (!stateOrder && loading) return <LoadingSpinner />;
  if (!stateOrder && error) {
    return (
      <div className="container section">
        <ErrorMessage message={error} />
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className="container section">
      <div className="confirmation-wrap">
        <div className="confirmation-icon">✓</div>
        <h1>Order Confirmed</h1>
        <p style={{ color: "var(--color-text-muted)", marginTop: 10 }}>
          Thank you, {order.firstName}. A confirmation has been recorded for your order.
        </p>
        <div className="order-number">Order #{order.orderNumber}</div>

        <div className="confirmation-card">
          <h3 style={{ marginBottom: 14 }}>Shipping To</h3>
          <p>
            {order.firstName} {order.lastName}
            <br />
            {order.address}
            <br />
            {order.city}, {order.country}
            <br />
            {order.email} · {order.phone}
          </p>
        </div>

        <div className="confirmation-card">
          <h3 style={{ marginBottom: 14 }}>Order Details</h3>
          {order.items.map((item) => (
            <div className="checkout-summary-line" key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}>
              <img src={productPlaceholder(item.productName)} alt={item.productName} />
              <div>
                <div className="line-name">
                  {item.productName} × {item.quantity}
                </div>
                <div className="line-meta">
                  {item.selectedSize} · {item.selectedColor}
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontWeight: 600 }}>${item.lineTotal.toFixed(2)}</div>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
          <p className="stock-note">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <Link to="/shop" className="btn btn-primary">
          Return to Shop
        </Link>
      </div>
    </div>
  );
}
