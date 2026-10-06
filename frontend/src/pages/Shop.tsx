import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Reveal from "../components/Reveal";

const PRICE_RANGES: Record<string, (price: number) => boolean> = {
  all: () => true,
  under25: (p) => p < 25,
  "25to50": (p) => p >= 25 && p <= 50,
  "50to100": (p) => p > 50 && p <= 100,
  over100: (p) => p > 100,
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { data: products, loading, error } = useFetch(() => productService.getAll(), []);

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "all";
  const price = params.get("price") ?? "all";
  const sort = params.get("sort") ?? "newest";

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setParams(next);
  }

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products;

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term),
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    const priceFilter = PRICE_RANGES[price] ?? PRICE_RANGES.all;
    result = result.filter((p) => priceFilter(p.price));

    result = [...result];
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, search, category, price, sort]);

  return (
    <div className="container section">
      <div className="section-header">
        <div>
          <h2>Shop All</h2>
          <div className="section-sub">Browse the full collection</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-bar">
          <span aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => updateParam("search", e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => updateParam("category", e.target.value)} aria-label="Filter by category">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={price} onChange={(e) => updateParam("price", e.target.value)} aria-label="Filter by price">
          <option value="all">All Prices</option>
          <option value="under25">Under $25</option>
          <option value="25to50">$25 – $50</option>
          <option value="50to100">$50 – $100</option>
          <option value="over100">Over $100</option>
        </select>

        <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} aria-label="Sort products">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>

        {!loading && products && <span className="filters-count">{filtered.length} products</span>}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState message="No products match your filters. Try adjusting your search." />
      )}

      {!loading && filtered.length > 0 && (
        <div className="product-grid">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 7) * 40}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
