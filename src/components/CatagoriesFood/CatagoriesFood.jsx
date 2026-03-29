import { use, useState } from "react";
import {
  FaArrowUp,
  FaBowlFood,
  FaCartShopping,
  FaFire,
  FaHeart,
  FaStar,
} from "react-icons/fa6";
import ViewDetailsModal from "../Offers/ViewDetailsModal";
import { useToast } from "../Toast/useToast";

const CatagoriesFood = ({
  manageMenuExplore,
  selectedCategory,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  favoriteItems,
}) => {
  const toast = useToast();
  const data = use(manageMenuExplore);
  const mealsData = data?.meals ?? null;
  const [selectedMealId, setSelectedMealId] = useState(null);

  // Deterministic pseudo-random values from id (keeps render pure and stable).
  const hashFromId = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return hash;
  };

  const getMealPrice = (id) => {
    const hash = hashFromId(id);
    return (hash % 1901) + 100; // 100-2000
  };

  const getMealRating = (id) => {
    const hash = hashFromId(id + "rating");
    const rating = 3.5 + (hash % 16) / 10; // 3.5-5.0
    return rating.toFixed(1);
  };

  const buildCategoryOffer = (meal) => {
    const price = getMealPrice(meal.idMeal);
    return {
      basePrice: price,
      finalPrice: price,
      offerLabel: "Category Pick",
      borderAccent: "#63e6be",
      glowColor: "rgba(99,230,190,0.34)",
      cartFood: {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
      },
      meal,
    };
  };

  const categoryOffers = (mealsData ?? []).map((meal) =>
    buildCategoryOffer(meal),
  );
  const selectedCategoryOffer = categoryOffers.find(
    (offer) => offer.meal?.idMeal === selectedMealId,
  );

  if (!mealsData) {
    return (
      <div className="mt-10 relative overflow-hidden flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] py-16 text-center shadow-[0_12px_30px_rgba(2,8,20,0.32)]">
        {/* bg glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.07)_0%,transparent_70%)] blur-2xl" />
        </div>
        {/* Icon */}
        <div className="relative grid h-16 w-16 place-items-center rounded-[18px] border border-[#1c2b43] bg-[rgba(99,230,190,0.1)] text-[#63e6be] shadow-[0_0_28px_rgba(99,230,190,0.2)] animate-pulse">
          <FaBowlFood size={28} />
        </div>
        {/* Text */}
        <div>
          <p className="text-[1.2rem] font-extrabold text-[#eef2ff]">
            No Category Selected
          </p>
          <p className="mt-2 text-sm text-[#8897b5] max-w-xs mx-auto leading-relaxed">
            Pick any category card above and tap{" "}
            <span className="font-bold text-[#63e6be]">Explore</span> to browse
            fresh meals.
          </p>
        </div>
        {/* Hint chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] px-4 py-2 text-xs font-semibold text-[#8897b5]">
          <FaArrowUp size={11} className="text-[#63e6be]" />
          Scroll up to choose a category
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Section sub-heading */}
      <div className="mb-8">
        <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-5">
          <div className="hidden h-px flex-1 bg-[linear-gradient(to_right,transparent,#1c2b43)] sm:block" />
          <div className="w-full px-2 text-center sm:w-auto sm:px-0">
            <p className="text-[#ff8f6a] uppercase tracking-[0.24em] text-xs font-extrabold">
              Menu Items
            </p>
            <h3 className="mt-1 whitespace-nowrap text-[1.26rem] sm:text-[1.9rem] font-black leading-tight text-[#f5f7ff]">
              {selectedCategory ? (
                <>
                  Fresh Picks —
                  <span className="ml-1 inline bg-[linear-gradient(130deg,#63e6be,#4dd9ac)] bg-clip-text text-transparent">
                    {selectedCategory}
                  </span>
                </>
              ) : (
                "Fresh Picks For You"
              )}
            </h3>
          </div>
          <div className="hidden h-px flex-1 bg-[linear-gradient(to_left,transparent,#1c2b43)] sm:block" />
        </div>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] px-3 py-1.5 text-sm font-semibold text-[#8897b5]">
            <FaFire className="text-[#ff8f6a]" />
            {mealsData.length} meals available
          </span>
        </div>
      </div>

      {/* Meals grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {mealsData.map((meal) => {
          const price = getMealPrice(meal.idMeal);
          const rating = getMealRating(meal.idMeal);
          const isFavorite = favoriteItems.some(
            (item) => item.id === meal.idMeal,
          );

          return (
            <article
              key={meal.idMeal}
              onClick={() => setSelectedMealId(meal.idMeal)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-[#3d5480] hover:shadow-[0_18px_34px_rgba(2,8,20,0.48)] cursor-pointer"
            >
              <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-3xl transition-transform duration-500 group-hover:scale-125" />

              {/* Image block */}
              <div className="relative overflow-hidden">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  loading="lazy"
                  className="w-full aspect-5/4 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,14,26,0.8)_0%,rgba(9,14,26,0.3)_50%,transparent_100%)] transition-opacity duration-300" />

                {/* Price badge – top right */}
                <span className="absolute right-4 top-4 rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] px-3 py-1.5 text-[0.85rem] font-extrabold text-[#071a12] shadow-lg border border-[rgba(99,230,190,0.4)] transition-transform duration-300 group-hover:scale-105">
                  ৳{price}
                </span>

                {/* Popular badge – top left */}
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-[#2f354a] bg-[#1a2035] px-3 py-1.5 text-[0.72rem] font-bold text-[#ffd166] shadow-[0_0_18px_rgba(255,143,106,0.14)] backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,106,0.14),transparent_72%)] animate-pulse" />
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff8f6a] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ffd166]" />
                  </span>
                  <FaFire className="relative text-[#ff9a76]" size={12} />
                  <span className="relative">Popular</span>
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-4 md:p-5">
                {/* Rating row */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={12}
                        className={
                          star <= Math.round(rating)
                            ? "text-[#ffd166] transition-transform duration-200"
                            : "text-[#3a4768]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#8897b5] ml-1">
                    ({rating})
                  </span>
                </div>

                {/* Meal name */}
                <h4 className="mt-3 line-clamp-2 text-[1.08rem] font-extrabold leading-snug text-[#eef2ff]">
                  {meal.strMeal}
                </h4>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer row */}
                <div className="mt-4 pt-4 border-t border-[#1c2b43]">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#8897b5]">
                        Price
                      </span>
                      <span className="mt-0.5 text-[1.15rem] font-black bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] bg-clip-text text-transparent">
                        ৳{price}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isFav = favoriteItems.some(
                          (item) => item.id === meal.idMeal,
                        );
                        onToggleFavorite(meal, price);
                        if (!isFav) {
                          toast.success(
                            `${meal.strMeal} added to favorites! ❤️`,
                          );
                        } else {
                          toast.info(`${meal.strMeal} removed from favorites`);
                        }
                      }}
                      className={`grid h-10 w-10 place-items-center rounded-xl border transition-all duration-300 ${
                        isFavorite
                          ? "border-[#ff8f6a] bg-[rgba(255,143,106,0.15)] text-[#ff8f6a] scale-105"
                          : "border-[#2b3d5e] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#ff8f6a] hover:text-[#ff8f6a] hover:bg-[rgba(255,143,106,0.05)]"
                      }`}
                      aria-label="Add to favorite"
                    >
                      <FaHeart
                        size={14}
                        className={isFavorite ? "animate-bounce" : ""}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(meal, price);
                        toast.success(`${meal.strMeal} added to cart! 🛒`);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] px-3 py-2.5 text-sm font-bold text-[#061510] shadow-[0_6px_18px_rgba(99,230,190,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(99,230,190,0.42)] active:translate-y-0"
                    >
                      <FaCartShopping size={14} />
                      Add to Cart
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyNow?.(meal, price);
                        toast.success(`${meal.strMeal} ready to checkout! 🎉`);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,209,102,0.45)] bg-[linear-gradient(135deg,#ffd166,#ffb347)] px-3 py-2.5 text-sm font-black text-[#2a1800] shadow-[0_8px_20px_rgba(255,209,102,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-125 active:translate-y-0"
                    >
                      Buy Now
                      <span className="rounded-full bg-[rgba(42,24,0,0.18)] px-2 py-0.5 text-[0.68rem] font-extrabold">
                        ৳{price}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedMealId && (
        <ViewDetailsModal
          idMeal={selectedMealId}
          offer={selectedCategoryOffer}
          onClose={() => setSelectedMealId(null)}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          buyNowScrollToTop={false}
        />
      )}
    </div>
  );
};

export default CatagoriesFood;
