import { Suspense, useMemo } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import CatagoriesFood from "../CatagoriesFood/CatagoriesFood";
import MenuItemCard from "./MenuItemCard";

const Menu = ({
  categories,
  categoriesLoading,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  favoriteItems,
}) => {
  const allCategoriesData = categories ?? [];
  const effectiveCategory =
    selectedCategory ?? allCategoriesData[0]?.strCategory ?? null;

  const manageMenuExplore = useMemo(() => {
    if (!effectiveCategory) {
      return Promise.resolve({ meals: null });
    }

    return fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${effectiveCategory}`,
    )
      .then((response) => response.json())
      .catch(() => ({ meals: null }));
  }, [effectiveCategory]);

  return (
    <section
      id="menu-section"
      className="relative overflow-hidden py-14 sm:py-16 md:py-20 bg-[radial-gradient(circle_at_12%_15%,#1b2235_0%,#11182a_36%,#0a0f1c_76%)]"
    >
      <div className="pointer-events-none absolute -left-35 -top-30 h-90 w-90 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.14)_0%,rgba(99,230,190,0)_70%)] blur-[50px]" />
      <div className="pointer-events-none absolute -right-30 bottom-8 h-80 w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.12)_0%,rgba(255,143,106,0)_70%)] blur-[50px]" />
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_16px_36px_rgba(2,8,20,0.35)] p-4 md:p-5">
          <p className="text-[#ff8f6a] tracking-[0.24em] text-xs font-extrabold uppercase">
            POPULAR CATEGORIES
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-[#f5f7ff] text-[1.8rem] sm:text-[2.1rem] md:text-[2.45rem] leading-[1.15] font-black">
              Pick Your Favorite
              <br />
              Food Category
            </h2>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#2b3d5e] bg-[rgba(15,24,42,0.7)] px-4 py-2.5 font-bold text-[#c8d3eb] transition duration-200 hover:-translate-y-0.5 hover:border-[#63e6be] hover:text-[#63e6be]">
              View all
              <FaArrowRightLong />
            </button>
          </div>
        </div>

        {categoriesLoading ? (
          <div className="mt-8 relative overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-8 text-center text-[#8897b5] shadow-[0_12px_30px_rgba(2,8,20,0.32)]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.1)_0%,transparent_70%)] blur-3xl" />
            </div>
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-[18px] border border-[#27406a] bg-[rgba(16,24,42,0.78)]">
              <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#2b3d5e] border-t-[#63e6be]" />
            </div>
            <p className="relative mt-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#63e6be] animate-pulse">
              Loading Categories
            </p>
            <p className="relative mt-2 text-xs font-semibold text-[#9ba5be]">
              Curating fresh picks for your next meal.
            </p>
          </div>
        ) : allCategoriesData.length === 0 ? (
          <div className="mt-8 relative overflow-hidden rounded-2xl border border-dashed border-[#2b3d5e] bg-[linear-gradient(160deg,rgba(16,24,42,0.94),rgba(9,14,27,0.95))] px-6 py-8 text-center shadow-[0_12px_30px_rgba(2,8,20,0.32)]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.1)_0%,transparent_70%)] blur-3xl" />
            </div>
            <p className="relative text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-[#ff8f6a]">
              Empty Menu
            </p>
            <p className="relative mt-2 text-sm font-bold text-[#d9e1f6]">
              No categories available right now.
            </p>
            <p className="relative mt-1 text-xs text-[#8897b5]">
              Please check again shortly.
            </p>
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {allCategoriesData.map((categoriesData, index) => (
              <MenuItemCard
                key={categoriesData.idCategory}
                categoriesData={categoriesData}
                setSelectedCategory={onSelectCategory}
                isActive={effectiveCategory === categoriesData.strCategory}
                index={index}
              />
            ))}
          </div>
        )}

        <div id="menu-items-section">
          <Suspense
            fallback={
              <div className="mt-8 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] px-6 py-8 text-center shadow-[0_12px_30px_rgba(2,8,20,0.32)]">
                <div className="mx-auto flex w-fit items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#63e6be] [animation-delay:-0.2s]" />
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#63e6be] [animation-delay:-0.1s]" />
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#63e6be]" />
                </div>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#63e6be]">
                  Loading Meals
                </p>
              </div>
            }
          >
            <CatagoriesFood
              manageMenuExplore={manageMenuExplore}
              selectedCategory={effectiveCategory}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onToggleFavorite={onToggleFavorite}
              favoriteItems={favoriteItems}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Menu;
