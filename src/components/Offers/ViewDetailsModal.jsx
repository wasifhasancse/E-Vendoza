import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaCopy, FaXmark } from "react-icons/fa6";

const ViewDetailsModal = ({
  idMeal,
  offer,
  onClose,
  onAddToCart,
  onBuyNow,
  buyNowScrollToTop = false,
}) => {
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedMealId, setCopiedMealId] = useState(false);
  const modalScrollRef = useRef(null);
  const contentScrollRef = useRef(null);
  const mealIdCopyTimerRef = useRef(null);

  useEffect(() => {
    const fetchMealDetails = async () => {
      if (!idMeal) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`,
        );
        const data = await response.json();
        const meal = data?.meals?.[0];

        if (meal) {
          setMealData(meal);
        } else {
          setError("Meal not found");
        }
      } catch {
        setError("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [idMeal]);

  useEffect(() => {
    // Always open from top so category and offer detail modals behave identically.
    modalScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setCopiedMealId(false);
  }, [idMeal]);

  useEffect(() => {
    return () => {
      if (mealIdCopyTimerRef.current) {
        clearTimeout(mealIdCopyTimerRef.current);
      }
    };
  }, []);

  if (!mealData && !loading) return null;
  if (typeof document === "undefined") return null;

  const meal = mealData;
  const displayMeal = meal || offer?.meal;

  const handleCopyMealId = async () => {
    if (!displayMeal?.idMeal || !navigator?.clipboard) return;

    await navigator.clipboard.writeText(String(displayMeal.idMeal));
    setCopiedMealId(true);

    if (mealIdCopyTimerRef.current) {
      clearTimeout(mealIdCopyTimerRef.current);
    }

    mealIdCopyTimerRef.current = setTimeout(() => {
      setCopiedMealId(false);
    }, 1800);
  };

  return createPortal(
    <div
      ref={modalScrollRef}
      className="fixed inset-0 z-9999 overflow-y-auto bg-[rgba(2,8,20,0.8)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-6">
        <div
          className="relative mx-auto flex w-full max-w-2xl max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.99),rgba(9,14,27,0.99))] shadow-[0_28px_60px_rgba(2,8,20,0.65)] sm:max-h-[calc(100vh-6rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-[#2b3d5e] bg-[rgba(10,16,30,0.7)] text-[#c8d3eb] transition-colors hover:border-[#ff8f6a] hover:text-[#ff8f6a]"
            aria-label="Close details"
          >
            <FaXmark size={16} />
          </button>

          {loading ? (
            <div className="relative flex h-96 items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-3xl" />
              </div>
              <div className="relative text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] border border-[#27406a] bg-[rgba(16,24,42,0.82)]">
                  <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#2b3d5e] border-t-[#63e6be]" />
                </div>
                <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#63e6be] animate-pulse">
                  Loading Meal Details
                </p>
                <p className="mt-2 text-xs text-[#8897b5]">
                  Fetching fresh information from kitchen records.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="relative flex h-96 items-center justify-center overflow-hidden px-6 text-center">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.14)_0%,transparent_70%)] blur-3xl" />
              </div>
              <div className="relative">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-[#ff8f6a]">
                  Unable To Load
                </p>
                <p className="mt-2 text-sm font-bold text-[#e7ecff]">{error}</p>
                <p className="mt-1 text-xs text-[#8897b5]">
                  Try closing and opening details again.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="h-44 w-full shrink-0 overflow-hidden sm:h-56">
                <img
                  src={displayMeal?.strMealThumb ?? offer?.image}
                  alt={displayMeal?.strMeal ?? offer?.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div
                ref={contentScrollRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6"
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff8f6a]">
                  {mealData ? "Meal Details" : "Offer Details"}
                </p>
                <h3 className="text-2xl font-black text-[#f5f7ff]">
                  {displayMeal?.strMeal}
                </h3>

                <div className="flex flex-wrap gap-2 text-xs">
                  {offer?.offerLabel && (
                    <span className="rounded-full border border-[rgba(99,230,190,0.22)] bg-[rgba(99,230,190,0.08)] px-2.5 py-1 font-bold text-[#63e6be]">
                      {offer.offerLabel}
                    </span>
                  )}
                  {displayMeal?.strCategory && (
                    <span className="rounded-full border border-[#2b3d5e] px-2.5 py-1 text-[#9ba5be]">
                      {displayMeal.strCategory}
                    </span>
                  )}
                  {displayMeal?.strArea && (
                    <span className="rounded-full border border-[#2b3d5e] px-2.5 py-1 text-[#9ba5be]">
                      {displayMeal.strArea}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {displayMeal?.strArea && (
                    <div className="rounded-xl border border-[#223252] bg-[rgba(10,16,30,0.68)] p-3">
                      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#7d8aa8]">
                        Origin Area
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#e7ecff]">
                        {displayMeal.strArea}
                      </p>
                    </div>
                  )}

                  {displayMeal?.strCategory && (
                    <div className="rounded-xl border border-[#223252] bg-[rgba(10,16,30,0.68)] p-3">
                      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#7d8aa8]">
                        Food Category
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#e7ecff]">
                        {displayMeal.strCategory}
                      </p>
                    </div>
                  )}

                  {displayMeal?.idMeal && (
                    <div className="rounded-xl border border-[#223252] bg-[rgba(10,16,30,0.68)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#7d8aa8]">
                            Meal ID
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#e7ecff]">
                            {displayMeal.idMeal}
                          </p>
                        </div>
                        <button
                          onClick={handleCopyMealId}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-bold transition-all duration-200 ${
                            copiedMealId
                              ? "border-[rgba(99,230,190,0.35)] bg-[rgba(99,230,190,0.12)] text-[#63e6be]"
                              : "border-[#2b3d5e] bg-[rgba(16,24,42,0.72)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be]"
                          }`}
                          aria-label="Copy Meal ID"
                        >
                          {copiedMealId ? (
                            <FaCheck size={11} />
                          ) : (
                            <FaCopy size={11} />
                          )}
                          {copiedMealId ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {offer && (
                  <div className="flex items-center justify-between rounded-xl border border-[#233453] bg-[rgba(10,16,30,0.7)] p-3.5 sm:p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-[#63e6be]">
                        Tk {offer.finalPrice}
                      </span>
                      {offer.basePrice > offer.finalPrice && (
                        <span className="text-sm font-semibold text-[#7d8aa8] line-through">
                          Tk {offer.basePrice}
                        </span>
                      )}
                    </div>
                    {offer.offerLabel && (
                      <span className="inline-block rounded-full border border-[rgba(99,230,190,0.4)] bg-[rgba(99,230,190,0.12)] px-3 py-1 text-xs font-bold text-[#63e6be]">
                        {offer.offerLabel}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm leading-relaxed text-[#8897b5]">
                  {displayMeal?.strInstructions ?? offer?.description}
                </p>

                {(() => {
                  const meal = displayMeal ?? {};
                  const items = [];

                  for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`]?.trim();
                    const measure = meal[`strMeasure${i}`]?.trim();

                    if (ingredient && measure) {
                      items.push({
                        ingredient,
                        measure,
                      });
                    }
                  }

                  if (items.length === 0) return null;

                  return (
                    <div className="rounded-2xl border border-[#233453] bg-[rgba(10,16,30,0.7)] p-4">
                      <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#7d8aa8]">
                        Ingredients and Measures ({items.length})
                      </p>
                      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-lg px-1 py-1">
                        {items.map((item) => (
                          <div
                            key={`${item.ingredient}-${item.measure}`}
                            className="flex items-center justify-between rounded-lg border border-[#1e2d48] bg-[rgba(7,11,24,0.58)] px-3 py-2 transition-colors hover:border-[#233453] hover:bg-[rgba(10,16,30,0.88)]"
                          >
                            <span className="text-sm font-semibold text-[#d5ddf5]">
                              {item.ingredient}
                            </span>
                            <span className="text-xs font-bold text-[#63e6be]">
                              {item.measure}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {offer && (
                  <div
                    className={`grid grid-cols-1 gap-2 ${onBuyNow ? "sm:grid-cols-2" : ""}`}
                  >
                    <button
                      onClick={() => {
                        onAddToCart?.(offer.cartFood, offer.finalPrice, {
                          basePrice: offer.basePrice,
                          offerType: offer.offerType,
                          offerLabel: offer.offerLabel,
                        });
                        onClose();
                      }}
                      className="rounded-xl border border-[#2b3d5e] bg-[rgba(10,16,30,0.72)] py-2.5 text-xs font-bold text-[#c8d3eb] transition-colors hover:border-[#63e6be] hover:text-[#63e6be]"
                    >
                      Add to Cart
                    </button>
                    {onBuyNow && (
                      <button
                        onClick={() => {
                          onBuyNow?.(offer.cartFood, offer.finalPrice, {
                            basePrice: offer.basePrice,
                            offerType: offer.offerType,
                            offerLabel: offer.offerLabel,
                            scrollToTop: buyNowScrollToTop,
                          });
                          onClose();
                        }}
                        className="rounded-xl py-2.5 text-xs font-bold text-[#071510] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                        style={{
                          background: `linear-gradient(135deg, ${offer.borderAccent}, ${offer.borderAccent}cc)`,
                          boxShadow: `0 10px 22px ${offer.glowColor}`,
                        }}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span>Buy Now</span>
                          <span className="text-[0.65rem] font-black">
                            Tk {offer.finalPrice}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ViewDetailsModal;
