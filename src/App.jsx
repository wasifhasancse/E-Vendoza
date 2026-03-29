import { useEffect, useState } from "react";
import "./App.css";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Menu from "./components/Menu/Menu";
import NavBar from "./components/NavBar/NavBar";
import Offers from "./components/Offers/Offers";
import ScrollUpButton from "./components/ScrollUpButton/ScrollUpButton";
import Testimonials from "./components/Testimonials/Testimonials";
import ToastContainer from "./components/Toast/ToastContainer";

const AUTH_SESSION_KEY = "e-vendoza-auth-session";

const loadFromStorage = (key, fallback = []) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // corrupted data — fall through to fallback
  }
  return fallback;
};

const isLoggedIn = () => {
  try {
    const session =
      window.localStorage.getItem(AUTH_SESSION_KEY) ||
      window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    return !!parsed?.email;
  } catch {
    return false;
  }
};

const requireAuth = (callback) => {
  if (isLoggedIn()) {
    callback();
  } else {
    window.dispatchEvent(new CustomEvent("open-auth-modal"));
  }
};

function App() {
  const [addToCartItems, setAddToCartItems] = useState(() =>
    loadFromStorage("e-vendoza-cart-items"),
  );
  const [favoriteItems, setFavoriteItems] = useState(() =>
    loadFromStorage("e-vendoza-favorite-items"),
  );
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php",
        );
        const data = await response.json();
        const nextCategories = data?.categories ?? [];

        if (!isMounted) return;

        setCategories(nextCategories);
        setSelectedCategory(
          (prev) => prev ?? nextCategories[0]?.strCategory ?? null,
        );
      } catch {
        if (!isMounted) return;
        setCategories([]);
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll to top on page load/reload
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    window.localStorage.setItem(
      "e-vendoza-cart-items",
      JSON.stringify(addToCartItems),
    );
  }, [addToCartItems]);

  // Persist favorites to localStorage on every change
  useEffect(() => {
    window.localStorage.setItem(
      "e-vendoza-favorite-items",
      JSON.stringify(favoriteItems),
    );
  }, [favoriteItems]);

  const addToCart = (meal, price, meta = {}) => {
    setAddToCartItems((prevItems) => {
      const cartId = meta.cartId ?? meal.idMeal;
      const existingItem = prevItems.find((item) => item.id === cartId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...prevItems,
        {
          id: cartId,
          name: meal.strMeal,
          image: meal.strMealThumb,
          price,
          basePrice: meta.basePrice ?? price,
          offerType: meta.offerType ?? null,
          offerLabel: meta.offerLabel ?? null,
          quantity: 1,
        },
      ];
    });
  };

  const handleAddToCart = (meal, price, meta = {}) => {
    requireAuth(() => addToCart(meal, price, meta));
  };

  const handleBuyNow = (meal, price, meta = {}) => {
    requireAuth(() => {
      addToCart(meal, price, meta);
      if (meta.scrollToTop) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      window.dispatchEvent(new CustomEvent("open-cart-panel"));
    });
  };

  const handleIncreaseQty = (id) => {
    setAddToCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecreaseQty = (id) => {
    setAddToCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (id) => {
    setAddToCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id),
    );
  };

  const handleClearCart = () => {
    setAddToCartItems([]);
  };

  const handleClearFavorites = () => {
    setFavoriteItems([]);
  };

  const toggleFavorite = (meal, price) => {
    setFavoriteItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === meal.idMeal);
      if (exists) {
        return prevItems.filter((item) => item.id !== meal.idMeal);
      }

      return [
        ...prevItems,
        {
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          price,
        },
      ];
    });
  };

  const handleToggleFavorite = (meal, price) => {
    requireAuth(() => toggleFavorite(meal, price));
  };

  const handleRemoveFavorite = (id) => {
    setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <ToastContainer />
      <NavBar
        addToCartItems={addToCartItems}
        favoriteItems={favoriteItems}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onIncreaseQty={handleIncreaseQty}
        onDecreaseQty={handleDecreaseQty}
        onRemoveItem={handleRemoveItem}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
        onClearCart={handleClearCart}
        onClearFavorites={handleClearFavorites}
      />
      <Hero onAddToCart={handleAddToCart} />

      <Menu
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleFavorite={handleToggleFavorite}
        favoriteItems={favoriteItems}
      />
      <Offers onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
      <About />
      <Testimonials />
      <Footer />
      <ScrollUpButton />
    </>
  );
}

export default App;
