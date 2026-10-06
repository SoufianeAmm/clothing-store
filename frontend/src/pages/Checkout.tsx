import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import { ApiError } from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import PhoneInput from "../components/PhoneInput";
import { productPlaceholder } from "../utils/productImage";
import { COUNTRIES } from "../data/countries";
import { formatCardNumber, formatExpiry, isValidCardNumber, isValidCvc, isValidExpiry } from "../utils/cardValidation";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

interface CardFormState {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
}

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  country: "",
};

const EMPTY_CARD: CardFormState = { name: "", number: "", expiry: "", cvc: "" };

const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING = 8;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const [dialCode, setDialCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [card, setCard] = useState<CardFormState>(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardFormState, string>>>({});

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // clearCart() empties `items` as part of the same update that navigates away after
  // a successful order; without this flag that re-render would hit the guard below
  // and redirect to /cart instead of letting the navigation to the confirmation page land.
  if (items.length === 0 && !orderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  function updateField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateCard(key: keyof CardFormState, value: string) {
    setCard((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    for (const key of Object.keys(form) as (keyof FormState)[]) {
      if (!form[key].trim()) {
        errors[key] = "This field is required";
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }
    setFieldErrors(errors);

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    const phoneValid = digitsOnly.length >= 6 && digitsOnly.length <= 14;
    setPhoneError(phoneValid ? "" : "Enter a valid phone number");

    const nextCardErrors: Partial<Record<keyof CardFormState, string>> = {};
    if (!card.name.trim()) nextCardErrors.name = "Name on card is required";
    if (!isValidCardNumber(card.number)) nextCardErrors.number = "Enter a valid card number";
    if (!isValidExpiry(card.expiry)) nextCardErrors.expiry = "Enter a valid, non-expired date";
    if (!isValidCvc(card.cvc)) nextCardErrors.cvc = "Enter a valid CVC";
    setCardErrors(nextCardErrors);

    return Object.keys(errors).length === 0 && phoneValid && Object.keys(nextCardErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      // card details are validated client-side only and never sent anywhere - this
      // checkout is simulated, so nothing resembling a real charge happens
      const order = await orderService.create({
        ...form,
        phone: `${dialCode} ${phoneNumber}`.trim(),
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
      });
      setOrderPlaced(true);
      navigate(`/order-confirmation/${order.orderNumber}`, { state: { order } });
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container section">
      <h2 style={{ marginBottom: 32 }}>Checkout</h2>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                className={fieldErrors.firstName ? "has-error" : ""}
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
              {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
            </div>
            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                className={fieldErrors.lastName ? "has-error" : ""}
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
              {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
            </div>

            <div className="field full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={fieldErrors.email ? "has-error" : ""}
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="field full">
              <label htmlFor="phone-number">Phone</label>
              <PhoneInput
                dialCode={dialCode}
                number={phoneNumber}
                onDialCodeChange={setDialCode}
                onNumberChange={setPhoneNumber}
                hasError={Boolean(phoneError)}
              />
              {phoneError && <span className="field-error">{phoneError}</span>}
            </div>

            <div className="field full">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                className={fieldErrors.address ? "has-error" : ""}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
              {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                className={fieldErrors.city ? "has-error" : ""}
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
              {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
            </div>
            <div className="field">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                className={fieldErrors.country ? "has-error" : ""}
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.country && <span className="field-error">{fieldErrors.country}</span>}
            </div>
          </div>

          <h3 style={{ margin: "28px 0 16px" }}>Payment Details</h3>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="cardName">Name on Card</label>
              <input
                id="cardName"
                className={cardErrors.name ? "has-error" : ""}
                value={card.name}
                onChange={(e) => updateCard("name", e.target.value)}
              />
              {cardErrors.name && <span className="field-error">{cardErrors.name}</span>}
            </div>

            <div className="field full">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                className={cardErrors.number ? "has-error" : ""}
                value={card.number}
                onChange={(e) => updateCard("number", formatCardNumber(e.target.value))}
              />
              {cardErrors.number && <span className="field-error">{cardErrors.number}</span>}
            </div>

            <div className="field">
              <label htmlFor="cardExpiry">Expiry (MM/YY)</label>
              <input
                id="cardExpiry"
                inputMode="numeric"
                placeholder="MM/YY"
                className={cardErrors.expiry ? "has-error" : ""}
                value={card.expiry}
                onChange={(e) => updateCard("expiry", formatExpiry(e.target.value))}
              />
              {cardErrors.expiry && <span className="field-error">{cardErrors.expiry}</span>}
            </div>
            <div className="field">
              <label htmlFor="cardCvc">CVC</label>
              <input
                id="cardCvc"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                className={cardErrors.cvc ? "has-error" : ""}
                value={card.cvc}
                onChange={(e) => updateCard("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
              {cardErrors.cvc && <span className="field-error">{cardErrors.cvc}</span>}
            </div>
          </div>

          {submitError && <ErrorMessage message={submitError} />}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 12 }}>
            {submitting ? "Placing order..." : `Place Order — $${total.toFixed(2)}`}
          </button>
          <p className="stock-note" style={{ textAlign: "center", marginTop: 12 }}>
            This is a simulated checkout — no real payment is processed, and no card details are sent or stored anywhere.
          </p>
        </form>

        <div className="summary-card">
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          {items.map((item) => (
            <div className="checkout-summary-line" key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}>
              <img src={productPlaceholder(item.product.name, item.product.category)} alt={item.product.name} />
              <div>
                <div className="line-name">
                  {item.product.name} × {item.quantity}
                </div>
                <div className="line-meta">
                  {item.selectedSize} · {item.selectedColor}
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontWeight: 600 }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="summary-row" style={{ marginTop: 12 }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
