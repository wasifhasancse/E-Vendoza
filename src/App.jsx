import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Menu from "./components/Menu/Menu";
import NavBar from "./components/NavBar/NavBar";
import Offers from "./components/Offers/Offers";
import Testimonials from "./components/Testimonials/Testimonials";

function App() {
  const [addToCartItems, setAddToCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
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

  const handleAddToCart = (meal, price) => {
    setAddToCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === meal.idMeal);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === meal.idMeal
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          price,
          quantity: 1,
        },
      ];
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

  const handleToggleFavorite = (meal, price) => {
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

  const handleRemoveFavorite = (id) => {
    setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <>
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
      />
      <Hero onAddToCart={handleAddToCart} />

      <Menu
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favoriteItems={favoriteItems}
      />
      <Offers />
      <Testimonials />
      <Footer />
    </>
  );
}

export default App;
