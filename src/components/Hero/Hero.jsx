import { useEffect, useMemo, useState } from "react";
import { FaClock, FaMotorcycle, FaPlay, FaStar } from "react-icons/fa";
import { FaBolt, FaCartShopping, FaShieldHalved } from "react-icons/fa6";
import usePublicJson from "../../hooks/usePublicJson";

const FALLBACK_HERO_CONTENT = {
  stats: [
    { value: "500+", label: "Restaurants" },
    { value: "28 min", label: "Avg Delivery" },
    { value: "50K+", label: "Orders/Day" },
    { value: "4.9 ★", label: "App Rating" },
  ],
  avatars: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  ],
  howItWorks: [
    {
      step: "01",
      icon: "clock",
      accent: "#63e6be",
      iconBg: "bg-[rgba(99,230,190,0.14)]",
      borderTop: "border-t-[#63e6be]",
      glow: "shadow-[0_0_22px_rgba(99,230,190,0.18)]",
      title: "Choose Your Meal",
      description:
        "Browse 500+ restaurants across Bangladesh. Filter by cuisine, price, or rating — find exactly what you crave in seconds.",
    },
    {
      step: "02",
      icon: "motorcycle",
      accent: "#ffd166",
      iconBg: "bg-[rgba(255,209,102,0.14)]",
      borderTop: "border-t-[#ffd166]",
      glow: "shadow-[0_0_22px_rgba(255,209,102,0.16)]",
      title: "Fast Delivery",
      description:
        "Verified local riders pick up your order and deliver it piping-hot to your door — average time just 28 minutes.",
    },
    {
      step: "03",
      icon: "shield",
      accent: "#ff8f6a",
      iconBg: "bg-[rgba(255,143,106,0.14)]",
      borderTop: "border-t-[#ff8f6a]",
      glow: "shadow-[0_0_22px_rgba(255,143,106,0.16)]",
      title: "Safe & Hygienic",
      description:
        "Every order is hygienically packed, tracked live on the map, and quality-checked before it leaves the kitchen.",
    },
  ],
};

const HOW_IT_WORKS_ICON_MAP = {
  clock: FaClock,
  motorcycle: FaMotorcycle,
  shield: FaShieldHalved,
};

const DEFAULT_HERO_MEALS = [
  {
    idMeal: "hero-default-1",
    strMeal: "Smash Burger",
    strMealThumb:
      "https://images.unsplash.com/photo-1687030047982-5217ceaced72?q=80&w=764&auto=format&fit=crop",
    strCategory: "Fast Food",
  },
  {
    idMeal: "hero-default-2",
    strMeal: "Creamy Pasta",
    strMealThumb:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80",
    strCategory: "Italian",
  },
];

const Hero = ({ onAddToCart }) => {
  const heroContent = usePublicJson("/data/hero.json", FALLBACK_HERO_CONTENT);
  const [heroFoods, setHeroFoods] = useState(DEFAULT_HERO_MEALS);
  const statsData = Array.isArray(heroContent?.stats)
    ? heroContent.stats
    : FALLBACK_HERO_CONTENT.stats;
  const avatarUrls = Array.isArray(heroContent?.avatars)
    ? heroContent.avatars
    : FALLBACK_HERO_CONTENT.avatars;
  const howItWorksData = Array.isArray(heroContent?.howItWorks)
    ? heroContent.howItWorks
    : FALLBACK_HERO_CONTENT.howItWorks;

  useEffect(() => {
    let isMounted = true;

    const fetchRandomFood = async () => {
      try {
        const [foodOneRes, foodTwoRes] = await Promise.all([
          fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
          fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        ]);
        const [foodOneData, foodTwoData] = await Promise.all([
          foodOneRes.json(),
          foodTwoRes.json(),
        ]);
        const foods = [foodOneData?.meals?.[0], foodTwoData?.meals?.[0]].filter(
          Boolean,
        );

        if (isMounted && foods.length > 0) {
          setHeroFoods(foods);
        }
      } catch {
        // Keep fallback food card content when API fails.
      }
    };

    fetchRandomFood();
    return () => {
      isMounted = false;
    };
  }, []);

  const getMealPrice = (mealId) => {
    const id = mealId ?? "hero-default";
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return (hash % 1901) + 100;
  };

  const getMealDiscount = (mealId) => {
    const id = mealId ?? "hero-default";
    let hash = 7;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 37 + id.charCodeAt(i)) >>> 0;
    }
    return (hash % 21) + 10;
  };

  const primaryFood = heroFoods[0] ?? DEFAULT_HERO_MEALS[0];
  const secondaryFood = heroFoods[1] ?? DEFAULT_HERO_MEALS[1];

  const primaryFoodPrice = useMemo(
    () => getMealPrice(primaryFood?.idMeal),
    [primaryFood],
  );
  const secondaryFoodPrice = useMemo(
    () => getMealPrice(secondaryFood?.idMeal),
    [secondaryFood],
  );
  const primaryFoodDiscount = useMemo(
    () => getMealDiscount(primaryFood?.idMeal),
    [primaryFood],
  );

  const handleHeroAddToCart = (meal, price) => {
    if (!onAddToCart || !meal) return;
    onAddToCart(meal, price);
  };
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_15%,#1b2235_0%,#11182a_36%,#0a0f1c_76%)]"
    >
      {/* ── Background decorations ── */}
      <div className="pointer-events-none absolute -left-40 -top-35 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.22)_0%,rgba(99,230,190,0)_70%)] blur-[50px]" />
      <div className="pointer-events-none absolute -right-35 bottom-10 h-95 w-95 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.2)_0%,rgba(255,143,106,0)_70%)] blur-[50px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[42px_42px] opacity-30" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-16 md:pb-24">
        {/* ════ HERO ROW ════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* ── Left — copy ── */}
          <div className="space-y-7">
            {/* Badge */}
            <div className="relative inline-flex overflow-hidden rounded-full border border-[#2f354a] bg-[#1a2035] px-4 py-2 text-xs font-semibold text-[#ff8f6a] shadow-[0_0_20px_rgba(255,143,106,0.08)] md:text-sm">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,106,0.14),transparent_72%)] animate-pulse" />
              <span className="relative inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff8f6a] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffd166]" />
                </span>
                <FaBolt className="text-[#ffd166]" size={11} />
                Bangladesh's #1 Food Delivery App
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-[2.55rem] sm:text-5xl lg:text-[3.55rem] font-black leading-[1.06] tracking-tight text-[#f5f7ff]">
                Hot &amp; Fresh Food
                <br />
                <span className="bg-[linear-gradient(130deg,#ff8f6a_15%,#ffd166_85%)] bg-clip-text text-transparent">
                  Delivered Fast
                </span>
                <br />
                To Your Door
              </h1>
              <p className="max-w-122.5 text-base md:text-lg leading-relaxed text-[#9ba5be]">
                Order from your favourite local restaurants and get piping-hot
                meals in as little as{" "}
                <span className="font-semibold text-[#f5f7ff]">30 minutes</span>
                . Live tracking, zero hidden fees, 100% fresh — every time.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="btn relative overflow-hidden border-0 rounded-full px-8 py-3 text-[#071510] font-bold bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] shadow-[0_10px_28px_rgba(99,230,190,0.38)] hover:brightness-110 transition-all duration-200">
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)] animate-[pulse_1.8s_ease-in-out_infinite]" />
                <span className="relative inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#071510] opacity-25 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#071510]" />
                  </span>
                  <span>Order Now</span>
                  <span>🍔</span>
                </span>
              </button>
              <button className="inline-flex items-center gap-3 font-semibold text-[#e8ecfa] transition-colors hover:text-[#63e6be]">
                <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#303851] bg-[#1b2133] text-[#ffd166] shadow-md">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,209,102,0.16),transparent_72%)] animate-pulse" />
                  <FaPlay size={12} />
                </span>
                How It Works
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-2.5 max-w-sm">
              {statsData.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[#222d47] bg-[rgba(13,20,36,0.72)] px-2 py-3 text-center"
                >
                  <p className="text-sm font-black text-[#f5f7ff]">{s.value}</p>
                  <p className="mt-0.5 text-[0.65rem] leading-tight text-[#8897b5]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                {avatarUrls.map((src, i) => (
                  <div key={i} className="avatar">
                    <div className="w-9 ring-2 ring-[#0e1525]">
                      <img src={src} alt={`Customer ${i + 1}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-[#f5f7ff]">
                  50,000+ Happy Customers
                </p>
                <p className="inline-flex items-center gap-0.5 text-xs text-[#9ba5be] mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar key={s} className="text-[#ffd166]" size={11} />
                  ))}
                  <span className="ml-1">4.9 (12.5k Reviews)</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Right — visual ── */}
          <div className="relative h-86 sm:h-112.5 md:h-130 lg:h-145">
            {/* Main blob image — NO animation */}
            <div className="absolute inset-3 overflow-hidden rounded-[46%_54%_56%_44%/_41%_44%_56%_59%] border border-[#27344e] bg-[#1c2538] shadow-[0_34px_72px_rgba(2,8,20,0.55)] sm:max-lg:inset-6 lg:inset-0">
              <img
                className="w-full h-full object-cover object-center scale-105"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
                alt="Colourful food spread"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(5,10,22,0.15),rgba(5,10,22,0.06))]" />
            </div>

            {/* Live tracking badge — top right */}
            <div className="absolute right-3 top-3 overflow-hidden rounded-full border border-[#2e3d5a] bg-[rgba(8,14,28,0.9)] px-3 py-1.5 shadow-[0_8px_24px_rgba(2,8,20,0.45)] backdrop-blur-md sm:right-6 sm:top-9">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,230,190,0.14),transparent_72%)] animate-pulse" />
              <span className="relative inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#63e6be] opacity-70 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#63e6be] shadow-[0_0_7px_#63e6be]" />
                </span>
                <span className="text-[0.72rem] font-bold text-[#d5ddf5]">
                  Live Tracking On
                </span>
              </span>
            </div>

            {/* Float card — primary food item (all devices) */}
            <div className="absolute bottom-3 left-1/2 z-30 flex w-[min(17.5rem,calc(100%-1.5rem))] -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-[#263048] bg-[rgba(9,15,28,0.92)] p-2.5 shadow-[0_16px_40px_rgba(2,8,20,0.58)] backdrop-blur-md sm:bottom-4 sm:left-auto sm:right-0 sm:w-60 sm:translate-x-0 sm:gap-3 lg:-right-4">
              <img
                src={
                  primaryFood?.strMealThumb ||
                  DEFAULT_HERO_MEALS[0].strMealThumb
                }
                alt={primaryFood?.strMeal || "Featured meal"}
                className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-15.5 sm:w-15.5"
              />
              <div className="min-w-0">
                <p className="text-[0.92rem] font-bold leading-tight text-[#f5f7ff] truncate sm:text-sm">
                  {primaryFood?.strMeal || "Featured Meal"}
                </p>
                <p className="text-[0.72rem] text-[#8897b5] truncate sm:text-xs">
                  {primaryFood?.strCategory || "Chef Special"}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex shrink-0 whitespace-nowrap text-[1rem] font-black leading-none text-[#63e6be] sm:text-base">
                    ৳&nbsp;{primaryFoodPrice}
                  </span>
                  <span className="relative inline-flex items-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-[rgba(255,143,106,0.28)] bg-[rgba(255,143,106,0.14)] px-2 py-0.5 text-[0.58rem] font-bold text-[#ffb08e] shadow-[0_0_18px_rgba(255,143,106,0.16)] sm:text-[0.6rem]">
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,106,0.2),transparent_70%)] animate-pulse" />
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff8f6a] opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ffd166]" />
                    </span>
                    <span className="relative">{primaryFoodDiscount}% OFF</span>
                  </span>
                  <button
                    onClick={() =>
                      handleHeroAddToCart(primaryFood, primaryFoodPrice)
                    }
                    className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#2b3d5e] bg-[rgba(16,24,42,0.72)] text-[#c8d3eb] transition-colors hover:border-[#63e6be] hover:text-[#63e6be] sm:h-6 sm:w-6"
                    aria-label="Add featured food to cart"
                  >
                    <FaCartShopping size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Float card — secondary food item (large devices only) */}
            <div className="absolute bottom-20 left-0 z-20 hidden w-60 items-center gap-2.5 rounded-2xl border border-[#263048] bg-[rgba(9,15,28,0.92)] p-2.5 shadow-[0_16px_40px_rgba(2,8,20,0.58)] backdrop-blur-md lg:flex lg:-left-4">
              <img
                src={
                  secondaryFood?.strMealThumb ||
                  DEFAULT_HERO_MEALS[1].strMealThumb
                }
                alt={secondaryFood?.strMeal || "Secondary featured meal"}
                className="h-13 w-13 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="max-w-33 truncate text-sm font-bold leading-tight text-[#f5f7ff]">
                  {secondaryFood?.strMeal || "Chef Pick"}
                </p>
                <p className="text-xs text-[#8897b5] truncate">
                  {secondaryFood?.strCategory || "Special"}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex shrink-0 whitespace-nowrap text-sm font-black leading-none text-[#63e6be]">
                    ৳&nbsp;{secondaryFoodPrice}
                  </span>
                  <span className="relative inline-flex items-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-[rgba(255,143,106,0.3)] bg-[rgba(255,143,106,0.14)] px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#ff9f7d] shadow-[0_0_18px_rgba(255,143,106,0.16)]">
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,106,0.2),transparent_70%)] animate-pulse" />
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff8f6a] opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ffd166]" />
                    </span>
                    <span className="relative">Hot Sell</span>
                  </span>
                  <button
                    onClick={() =>
                      handleHeroAddToCart(secondaryFood, secondaryFoodPrice)
                    }
                    className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#2b3d5e] bg-[rgba(16,24,42,0.72)] text-[#c8d3eb] transition-colors hover:border-[#63e6be] hover:text-[#63e6be]"
                    aria-label="Add secondary featured food to cart"
                  >
                    <FaCartShopping size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ HOW IT WORKS ════ */}
        <div id="how-it-works-section" className="mt-20 md:mt-28">
          {/* Section header */}
          <div className="mb-12 flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-5">
            <div className="hidden h-px flex-1 bg-[linear-gradient(to_right,transparent,#243050)] md:block" />
            <div className="text-center max-w-76 sm:max-w-none">
              <p className="text-[#ff8f6a] uppercase tracking-[0.24em] text-xs font-extrabold">
                How It Works
              </p>
              <h2 className="mt-2 text-[1.7rem] sm:text-3xl md:text-[2.1rem] font-black leading-tight text-[#f5f7ff]">
                Order Food in{" "}
                <span className="block sm:inline bg-[linear-gradient(130deg,#63e6be,#4dd9ac)] bg-clip-text text-transparent">
                  3 Simple Steps
                </span>
              </h2>
            </div>
            <div className="hidden h-px flex-1 bg-[linear-gradient(to_left,transparent,#243050)] md:block" />
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksData.map((item) => {
              const Icon = HOW_IT_WORKS_ICON_MAP[item.icon] ?? FaClock;
              return (
                <article
                  key={item.title}
                  className={`relative overflow-hidden rounded-2xl border border-t-[3px] border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-6 shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition duration-250 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_rgba(2,8,20,0.5)] ${item.borderTop}`}
                >
                  <div
                    className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-[0.15] blur-3xl"
                    style={{ background: item.accent }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-[3.2rem] font-black leading-none select-none opacity-[0.12]"
                        style={{ color: item.accent }}
                      >
                        {item.step}
                      </span>
                      <div
                        className={`inline-grid h-12 w-12 shrink-0 place-items-center rounded-[14px] ${item.iconBg} ${item.glow}`}
                        style={{ color: item.accent }}
                      >
                        <Icon size={22} />
                      </div>
                    </div>
                    <h3 className="mt-4 text-[1.12rem] font-extrabold text-[#eef2ff]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-[#8897b5]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom CTA banner */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#1e2d48] bg-[linear-gradient(135deg,rgba(16,24,44,0.95),rgba(9,14,27,0.95))] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-extrabold text-[#f5f7ff]">
                Ready to order?
              </p>
              <p className="mt-0.5 text-sm text-[#8897b5]">
                Your first delivery is{" "}
                <span className="font-bold text-[#63e6be]">FREE</span> — no
                promo code needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn border-0 rounded-full px-6 text-[#071510] font-bold bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] shadow-[0_8px_22px_rgba(99,230,190,0.32)] hover:brightness-110 transition-all">
                Start Ordering
              </button>
              <button className="btn rounded-full border border-[#2b3d5e] bg-transparent px-6 font-semibold text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-all">
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
