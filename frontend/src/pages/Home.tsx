import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Reveal from "../components/Reveal";
import HeroBackground from "../components/HeroBackground";
import { productPlaceholder } from "../utils/productImage";

export default function Home() {
  const { data: products, loading, error } = useFetch(() => productService.getAll(), []);

  const featured = useMemo(() => products?.slice(0, 4) ?? [], [products]);

  const newArrivals = useMemo(() => {
    if (!products) return [];
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [products]);

  const bestSellers = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => a.stock - b.stock).slice(0, 4);
  }, [products]);

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.category))).slice(0, 8);
  }, [products]);

  return (
    <div>
      <section className="hero">
        <HeroBackground />
        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow hero-anim hero-anim-1">New Season Arrivals</span>
            <h1 className="hero-anim hero-anim-2">Everyday essentials, considered design.</h1>
            <p className="hero-anim hero-anim-3">
              Clean silhouettes and durable fabrics, built for the way you actually get dressed.
              Explore the new collection.
            </p>
            <Link to="/shop" className="btn btn-primary hero-anim hero-anim-4">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {loading && <LoadingSpinner />}
      {error && (
        <div className="container" style={{ paddingTop: 40 }}>
          <ErrorMessage message={error} />
        </div>
      )}

      {products && (
        <>
          <section className="section container">
            <Reveal className="section-header">
              <div>
                <h2>Featured Products</h2>
                <div className="section-sub">Hand-picked pieces from the current collection</div>
              </div>
              <Link to="/shop" className="section-link">
                View all
              </Link>
            </Reveal>
            <div className="product-grid">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>

          <section className="section container" id="categories">
            <Reveal className="section-header">
              <div>
                <h2>Shop by Category</h2>
                <div className="section-sub">Find exactly what you're looking for</div>
              </div>
            </Reveal>
            <div className="category-grid">
              {categories.map((category, i) => (
                <Reveal key={category} delay={i * 50}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(category)}`}
                    className="category-card"
                    style={{ backgroundImage: `url(${productPlaceholder(category, category)})` }}
                  >
                    <span>{category}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="section container">
            <Reveal className="promo-banner">
              <div>
                <h3>Free shipping on orders over $75</h3>
                <p>No code needed — discount applied automatically at checkout.</p>
              </div>
              <Link to="/shop" className="btn btn-primary" style={{ background: "#fff", color: "#17171a" }}>
                Start Shopping
              </Link>
            </Reveal>
          </section>

          <section className="section container">
            <Reveal className="section-header">
              <div>
                <h2>New Arrivals</h2>
                <div className="section-sub">Just landed this week</div>
              </div>
              <Link to="/shop?sort=newest" className="section-link">
                View all
              </Link>
            </Reveal>
            <div className="product-grid">
              {newArrivals.map((product, i) => (
                <Reveal key={product.id} delay={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>

          <section className="section container">
            <Reveal className="section-header">
              <div>
                <h2>Best Sellers</h2>
                <div className="section-sub">Customer favorites, selling fast</div>
              </div>
              <Link to="/shop" className="section-link">
                View all
              </Link>
            </Reveal>
            <div className="product-grid">
              {bestSellers.map((product, i) => (
                <Reveal key={product.id} delay={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
