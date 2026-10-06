import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
