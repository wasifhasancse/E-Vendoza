import { use, useMemo } from "react";
import {
  FaArrowUp,
  FaBowlFood,
  FaCartShopping,
  FaFire,
  FaStar,
} from "react-icons/fa6";

const CatagoriesFood = ({ manageMenuExplore, selectedCategory }) => {
  const data = use(manageMenuExplore);
  const mealsData = data?.meals ?? null;

  // Generate stable random prices (100–2000 Tk) keyed by meal id
  const priceMap = useMemo(() => {
    if (!mealsData) return {};
    return Object.fromEntries(
      mealsData.map((meal) => [
        meal.idMeal,
        Math.floor(Math.random() * 1901) + 100,
      ]),
    );
  }, [mealsData]);

  // Generate stable random ratings (3.5–5.0)
  const ratingMap = useMemo(() => {
    if (!mealsData) return {};
    return Object.fromEntries(
      mealsData.map((meal) => [
        meal.idMeal,
        (Math.random() * 1.5 + 3.5).toFixed(1),
      ]),
    );
  }, [mealsData]);

  if (!mealsData) {
    return (
      <div className="mt-10 relative overflow-hidden flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] py-16 text-center shadow-[0_12px_30px_rgba(2,8,20,0.32)]">
        {/* bg glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.07)_0%,transparent_70%)] blur-2xl" />
        </div>
        {/* Icon */}
        <div className="relative grid h-16 w-16 place-items-center rounded-[18px] border border-[#1c2b43] bg-[rgba(99,230,190,0.1)] text-[#63e6be] shadow-[0_0_28px_rgba(99,230,190,0.2)]">
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
        <div className="flex items-center gap-5 mb-4">
          <div className="h-px flex-1 bg-[linear-gradient(to_right,transparent,#1c2b43)]" />
          <div className="text-center shrink-0">
            <p className="text-[#ff8f6a] uppercase tracking-[0.24em] text-xs font-extrabold">
              Menu Items
            </p>
            <h3 className="mt-1 text-[1.5rem] sm:text-[1.9rem] font-black leading-tight text-[#f5f7ff]">
              {selectedCategory ? (
                <>
                  Fresh Picks —{" "}
                  <span className="bg-[linear-gradient(130deg,#63e6be,#4dd9ac)] bg-clip-text text-transparent">
                    {selectedCategory}
                  </span>
                </>
              ) : (
                "Fresh Picks For You"
              )}
            </h3>
          </div>
          <div className="h-px flex-1 bg-[linear-gradient(to_left,transparent,#1c2b43)]" />
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
          const price = priceMap[meal.idMeal];
          const rating = ratingMap[meal.idMeal];

          return (
            <article
              key={meal.idMeal}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition-all duration-300 hover:-translate-y-2 hover:border-[#3d5480] hover:shadow-[0_24px_44px_rgba(2,8,20,0.54)]"
            >
              <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.1)_0%,transparent_70%)] blur-3xl" />
              {/* Image block */}
              <div className="relative overflow-hidden">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  loading="lazy"
                  className="w-full aspect-[5/4] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,14,26,0.72)_0%,transparent_50%)]" />

                {/* Price badge – top right */}
                <span className="absolute right-3 top-3 rounded-xl bg-[#63e6be] px-2.5 py-1 text-[0.8rem] font-extrabold text-[#071a12] shadow-lg">
                  ৳{price}
                </span>

                {/* Popular badge – top left */}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#2f354a] bg-[#1a2035] px-2.5 py-1 text-[0.7rem] font-bold text-[#ffd166]">
                  <FaFire className="text-[#ff9a76]" size={10} />
                  Popular
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-4 md:p-5">
                {/* Rating row */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={11}
                        className={
                          star <= Math.round(rating)
                            ? "text-[#ffd166]"
                            : "text-[#3a4768]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#8897b5]">
                    {rating}
                  </span>
                </div>

                {/* Meal name */}
                <h4 className="mt-2.5 line-clamp-2 text-[1.05rem] font-extrabold leading-snug text-[#eef2ff]">
                  {meal.strMeal}
                </h4>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer row */}
                <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-[#1c2b43]">
                  <div className="flex flex-col">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-[#8897b5]">
                      Price
                    </span>
                    <span className="text-[1.1rem] font-black text-[#63e6be]">
                      ৳{price}
                    </span>
                  </div>

                  <button className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] px-3.5 py-2 text-sm font-bold text-[#061510] shadow-[0_6px_18px_rgba(99,230,190,0.28)] transition-all duration-200 hover:shadow-[0_8px_22px_rgba(99,230,190,0.42)] hover:scale-105 active:scale-95">
                    <FaCartShopping size={13} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CatagoriesFood;
