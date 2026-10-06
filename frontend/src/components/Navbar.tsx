import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = search.trim();
    navigate(term ? `/shop?search=${encodeURIComponent(term)}` : "/shop");
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          AURELIA
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop">Shop</NavLink>
            </li>
            <li>
              <Link to="/#categories">Categories</Link>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <form className="search-bar" onSubmit={handleSearch}>
            <span aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </form>

          <Link to="/cart" className="icon-btn" aria-label={`Cart (${itemCount} items)`}>
            🛍
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          <button
            type="button"
            className="icon-btn nav-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="container mobile-menu open">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/#categories" onClick={() => setMenuOpen(false)}>
            Categories
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      )}
    </header>
  );
}
