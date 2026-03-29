import { useEffect, useState } from "react";
import {
  FaArrowRightLong,
  FaBolt,
  FaClock,
  FaPercent,
  FaTruck,
} from "react-icons/fa6";
import OfferCard from "./OfferCard";
import ViewDetailsModal from "./ViewDetailsModal";

const ICON_MAP = {
  truck: FaTruck,
  clock: FaClock,
  percent: FaPercent,
  bolt: FaBolt,
};

const getMealBasePrice = (mealId) => {
  const id = mealId ?? "offer-default";
  let hash = 11;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return (hash % 481) + 220;
};

const getFinalPriceByOffer = (basePrice, offer) => {
  if (offer.offerType === "free_item") return 0;
  if (offer.offerType === "percent_off") {
    const percent = Number(offer.discountPercent) || 0;
    return Math.max(0, Math.round(basePrice - (basePrice * percent) / 100));
  }
  if (offer.offerType === "flat_off") {
    const amount = Number(offer.discountAmount) || 0;
    return Math.max(0, Math.round(basePrice - amount));
  }
  return basePrice;
};

const buildOfferWithMeal = (template, meal) => {
  const basePrice = getMealBasePrice(meal?.idMeal);
  const finalPrice = getFinalPriceByOffer(basePrice, template);
  const cartFood = {
    idMeal: `${meal?.idMeal ?? template.id}-${template.id}`,
    strMeal: meal?.strMeal ?? template.title,
    strMealThumb: meal?.strMealThumb ?? template.image,
  };

  return {
    ...template,
    meal,
    cartFood,
    basePrice,
    finalPrice,
  };
};

const Offers = ({ onAddToCart, onBuyNow }) => {
  const [offersData, setOffersData] = useState({ offers: [], highlights: [] });
  const [selectedMealId, setSelectedMealId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadOffersData = async () => {
      try {
        const response = await fetch("/data/offers.json");
        const data = await response.json();
        const templates = data?.offers ?? [];

        const randomMeals = await Promise.all(
          templates.map(async () => {
            try {
              const randomRes = await fetch(
                "https://www.themealdb.com/api/json/v1/1/random.php",
              );
              const randomData = await randomRes.json();
              return randomData?.meals?.[0] ?? null;
            } catch {
              return null;
            }
          }),
        );

        const mergedOffers = templates.map((offer, index) => {
          const randomMeal = randomMeals[index] ?? {
            idMeal: `fallback-${offer.id}`,
            strMeal: offer.title,
            strMealThumb: offer.image,
            strCategory: "Special Offer",
            strArea: "Bangladesh",
            strInstructions: offer.description,
          };
          return buildOfferWithMeal(offer, randomMeal);
        });

        if (!mounted) return;
        setOffersData({
          offers: mergedOffers,
          highlights: data?.highlights ?? [],
        });
      } catch {
        if (!mounted) return;
        setOffersData({ offers: [], highlights: [] });
      }
    };

    loadOffersData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="offers-section"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_10%,#1b2235_0%,#11182a_36%,#0a0f1c_76%)] py-14 sm:py-16 md:py-20"
    >
      {/* background blobs */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.13)_0%,transparent_70%)] blur-[50px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,209,102,0.11)_0%,transparent_70%)] blur-[50px]" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div className="rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 md:p-5 shadow-[0_16px_36px_rgba(2,8,20,0.35)]">
          <p className="text-[#ff8f6a] tracking-[0.24em] text-xs font-extrabold uppercase">
            Special Offers
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-[#f5f7ff] text-[1.8rem] sm:text-[2.1rem] md:text-[2.45rem] leading-[1.15] font-black">
              Hot Deals &amp; Exclusive
              <br />
              <span className="bg-[linear-gradient(130deg,#63e6be_20%,#4dd9ac_100%)] bg-clip-text text-transparent">
                Discounts For You
              </span>
            </h2>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#2b3d5e] bg-[rgba(15,24,42,0.7)] px-4 py-2.5 font-bold text-[#c8d3eb] transition duration-200 hover:-translate-y-0.5 hover:border-[#63e6be] hover:text-[#63e6be]">
              All Deals
              <FaArrowRightLong />
            </button>
          </div>
        </div>

        {/* Offer cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {offersData.offers.length === 0 ? (
            <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-dashed border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.94),rgba(9,14,27,0.95))] px-6 py-8 text-center shadow-[0_12px_30px_rgba(2,8,20,0.32)]">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.1)_0%,transparent_70%)] blur-3xl" />
              </div>
              <p className="relative text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-[#63e6be]">
                No Active Offers
              </p>
              <p className="relative mt-2 text-sm font-bold text-[#d9e1f6]">
                Offer data is unavailable right now.
              </p>
              <p className="relative mt-1 text-xs text-[#8897b5]">
                We are preparing fresh discounts for you.
              </p>
            </div>
          ) : (
            offersData.offers.map((offer, index) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                index={index}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onViewDetails={(offer) => setSelectedMealId(offer.meal?.idMeal)}
              />
            ))
          )}
        </div>

        {/* Highlight feature strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {offersData.highlights.map(({ icon, accent, iconBg, title, sub }) => {
            const HighlightIcon = ICON_MAP[icon] ?? FaBolt;
            return (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-3.5 shadow-[0_8px_20px_rgba(2,8,20,0.28)] sm:p-4"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ color: accent, background: iconBg }}
                >
                  <HighlightIcon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#eef2ff]">
                    {title}
                  </p>
                  <p className="text-[0.7rem] text-[#8897b5]">{sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMealId && (
        <ViewDetailsModal
          idMeal={selectedMealId}
          offer={offersData.offers.find(
            (o) => o.meal?.idMeal === selectedMealId,
          )}
          onClose={() => setSelectedMealId(null)}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          buyNowScrollToTop={false}
        />
      )}
    </section>
  );
};

export default Offers;
