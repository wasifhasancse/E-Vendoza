import { Suspense, useState } from "react";
import "./App.css";
import Hero from "./components/Hero/Hero";
import Menu from "./components/Menu/Menu";
import NavBar from "./components/NavBar/NavBar";

const getCategoriesPromiseData = async () => {
  const categoriesPromise = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php",
  );
  return await categoriesPromise.json();
};
const getCategoriesPromise = getCategoriesPromiseData();

function App() {
  const [addToCartItems, setAddToCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

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
        onIncreaseQty={handleIncreaseQty}
        onDecreaseQty={handleDecreaseQty}
        onRemoveItem={handleRemoveItem}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
      />
      <Hero />

      <Suspense
        fallback={
          <div className="flex justify-center py-16 bg-[#0a0f1c]">
            <span className="loading loading-bars loading-xl text-[#63e6be]"></span>
          </div>
        }
      >
        <Menu
          getCategoriesPromise={getCategoriesPromise}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favoriteItems={favoriteItems}
        />
      </Suspense>
    </>
  );
}

export default App;
