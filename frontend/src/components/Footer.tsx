import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              AURELIA
            </div>
            <p>Modern essentials, made to last. Considered design for everyday wear.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li>
                <Link to="/shop">All Products</Link>
              </li>
              <li>
                <Link to="/shop?sort=newest">New Arrivals</Link>
              </li>
              <li>
                <Link to="/shop?category=Hoodies">Hoodies</Link>
              </li>
              <li>
                <Link to="/shop?category=Footwear">Footwear</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>Shipping &amp; Returns</li>
              <li>Size Guide</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AURELIA. All rights reserved.</span>
          <span>Crafted for the portfolio.</span>
        </div>
      </div>
    </footer>
  );
}
