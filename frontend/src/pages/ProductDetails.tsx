import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import QuantitySelector from "../components/QuantitySelector";
import { productPlaceholder } from "../utils/productImage";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { addItem } = useCart();

  const { data: product, loading, error } = useFetch(
    () => productService.getById(productId),
    [productId],
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="container section">
        <ErrorMessage message={error} />
      </div>
    );
  }
  if (!product) return null;

  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      setValidationError("Please select a size and color before adding to cart.");
      return;
    }
    setValidationError("");
    addItem(product!, quantity, selectedSize, selectedColor);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  }

  return (
    <div className="container section">
      <div className="breadcrumb">
        <Link to="/shop">Shop</Link> / {product.category} / {product.name}
      </div>

      <div className="product-detail">
        <div className="product-detail-image hero-anim hero-anim-1">
          <img src={productPlaceholder(product.name, product.category)} alt={product.name} />
        </div>

        <div className="product-detail-info hero-anim hero-anim-2">
          <h1>{product.name}</h1>
          <div className="product-detail-price">${product.price.toFixed(2)}</div>
          <p className="product-detail-description">{product.description}</p>

          <div className="option-group">
            <div className="option-group-label">
              <span>Size</span>
              {selectedSize && <span>{selectedSize}</span>}
            </div>
            <div className="option-pills">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`option-pill${selectedSize === size ? " selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-group-label">
              <span>Color</span>
              {selectedColor && <span>{selectedColor}</span>}
            </div>
            <div className="option-pills">
              {product.availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`option-pill${selectedColor === color ? " selected" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {validationError && <ErrorMessage message={validationError} />}

          <div className="product-detail-actions">
            <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
            <button type="button" className="btn btn-primary" onClick={handleAddToCart} disabled={outOfStock}>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {addedMessage && (
            <p className="stock-note">
              Added to cart. <Link to="/cart">View cart →</Link>
            </p>
          )}

          <p className="stock-note">
            {outOfStock ? "This item is currently out of stock." : `${product.stock} in stock`}
          </p>
        </div>
      </div>
    </div>
  );
}
