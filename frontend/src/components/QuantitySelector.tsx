interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, max }: QuantitySelectorProps) {
  const atMax = max !== undefined && quantity >= max;

  return (
    <div className="quantity-selector">
      <button type="button" onClick={() => onChange(quantity - 1)} disabled={quantity <= 1} aria-label="Decrease quantity">
        −
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={() => onChange(quantity + 1)} disabled={atMax} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
