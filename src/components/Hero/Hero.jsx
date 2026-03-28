import { FaClock, FaMotorcycle, FaPlay, FaStar } from "react-icons/fa";
import { FaBolt, FaLocationDot, FaShieldHalved } from "react-icons/fa6";

const STATS = [
  { value: "500+", label: "Restaurants" },
  { value: "28 min", label: "Avg Delivery" },
  { value: "50K+", label: "Orders/Day" },
  { value: "4.9 ★", label: "App Rating" },
];

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    Icon: FaClock,
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
    Icon: FaMotorcycle,
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
    Icon: FaShieldHalved,
    accent: "#ff8f6a",
    iconBg: "bg-[rgba(255,143,106,0.14)]",
    borderTop: "border-t-[#ff8f6a]",
    glow: "shadow-[0_0_22px_rgba(255,143,106,0.16)]",
    title: "Safe & Hygienic",
    description:
      "Every order is hygienically packed, tracked live on the map, and quality-checked before it leaves the kitchen.",
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_15%,#1b2235_0%,#11182a_36%,#0a0f1c_76%)]">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2f354a] bg-[#1a2035] px-4 py-2 text-xs font-semibold text-[#ff8f6a] md:text-sm">
              <FaBolt className="text-[#ffd166]" size={11} />
              Bangladesh's #1 Food Delivery App
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
              <button className="btn border-0 rounded-full px-8 py-3 text-[#071510] font-bold bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] shadow-[0_10px_28px_rgba(99,230,190,0.38)] hover:brightness-110 transition-all duration-200">
                Order Now 🍔
              </button>
              <button className="inline-flex items-center gap-3 font-semibold text-[#e8ecfa] transition-colors hover:text-[#63e6be]">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#303851] bg-[#1b2133] text-[#ffd166] shadow-md">
                  <FaPlay size={12} />
                </span>
                How It Works
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-2.5 max-w-sm">
              {STATS.map((s) => (
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
                {AVATAR_URLS.map((src, i) => (
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
          <div className="relative h-86.25 sm:h-112.5 md:h-130 lg:h-145">
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
            <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-[#2e3d5a] bg-[rgba(8,14,28,0.9)] px-3 py-1.5 shadow-[0_8px_24px_rgba(2,8,20,0.45)] backdrop-blur-md sm:right-6 sm:top-9">
              <span className="h-2 w-2 rounded-full bg-[#63e6be] shadow-[0_0_7px_#63e6be]" />
              <span className="text-[0.72rem] font-bold text-[#d5ddf5]">
                Live Tracking On
              </span>
            </div>

            {/* Float card — rider, bottom-left */}
            <div className="absolute bottom-20 left-3 z-20 flex w-55 min-w-0 items-center gap-2.5 rounded-2xl border border-[#263048] bg-[rgba(9,15,28,0.92)] px-3 py-2.5 shadow-[0_16px_40px_rgba(2,8,20,0.58)] backdrop-blur-md sm:top-auto sm:bottom-16 sm:left-0 sm:right-auto sm:w-auto sm:min-w-57.5 sm:gap-3 sm:px-3.5 sm:py-3 lg:-left-4">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt="Rider"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#63e6be]/30 shrink-0 sm:h-11 sm:w-11"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight text-[#f5f7ff]">
                  Karim Rahman
                </p>
                <p className="text-[0.68rem] sm:text-xs font-semibold text-[#63e6be] truncate">
                  Your Rider · 3 min away
                </p>
              </div>
              <div className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#63e6be] text-[#071510] sm:h-8 sm:w-8">
                <FaLocationDot size={13} />
              </div>
            </div>

            {/* Float card — featured item, bottom-right */}
            <div className="absolute bottom-4 right-3 z-30 flex w-48 min-w-0 items-center gap-2 rounded-2xl border border-[#263048] bg-[rgba(9,15,28,0.92)] p-2 shadow-[0_16px_40px_rgba(2,8,20,0.58)] backdrop-blur-md sm:bottom-4 sm:right-0 sm:min-w-50 sm:w-auto sm:gap-3 sm:p-2.5 lg:-right-4">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=260&q=80"
                alt="Smash Burger"
                className="h-12.5 w-12.5 shrink-0 rounded-xl object-cover sm:h-15.5 sm:w-15.5"
              />
              <div className="min-w-0">
                <p className="text-[0.86rem] sm:text-sm font-bold leading-tight text-[#f5f7ff] truncate">
                  Smash Burger
                </p>
                <p className="text-[0.68rem] sm:text-xs text-[#8897b5] truncate">
                  Extra Cheese 🧀
                </p>
                <div className="mt-1 flex items-center gap-1 sm:gap-1.5">
                  <span className="text-[0.95rem] sm:text-base font-black text-[#63e6be]">
                    ৳ 320
                  </span>
                  <span className="rounded-full bg-[rgba(99,230,190,0.12)] px-1.5 py-0.5 text-[0.56rem] sm:text-[0.6rem] font-bold text-[#63e6be] whitespace-nowrap">
                    #1 Today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ HOW IT WORKS ════ */}
        <div className="mt-20 md:mt-28">
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
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.Icon;
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
