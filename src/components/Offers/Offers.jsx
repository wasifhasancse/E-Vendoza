import {
  FaArrowRightLong,
  FaBolt,
  FaClock,
  FaPercent,
  FaTruck,
} from "react-icons/fa6";

const OFFER_CARDS = [
  {
    id: 1,
    tag: "Limited Time",
    tagColor: "#ffd166",
    tagBg: "rgba(255,209,102,0.12)",
    tagBorder: "rgba(255,209,102,0.28)",
    glowColor: "rgba(255,209,102,0.14)",
    borderAccent: "#ffd166",
    badge: "🔥",
    title: "First Order Free Delivery",
    description:
      "New to E-Vendoza? Enjoy completely free delivery on your very first order — no minimum spend, no promo code needed.",
    discount: "FREE",
    discountSub: "Delivery",
    cta: "Order Now",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: 2,
    tag: "Weekend Deal",
    tagColor: "#63e6be",
    tagBg: "rgba(99,230,190,0.10)",
    tagBorder: "rgba(99,230,190,0.28)",
    glowColor: "rgba(99,230,190,0.13)",
    borderAccent: "#63e6be",
    badge: "🎉",
    title: "Weekend Special — 20% Off",
    description:
      "Every Saturday & Sunday, get 20% off your total bill from 500+ partner restaurants. Valid on orders above ৳299.",
    discount: "20%",
    discountSub: "Off Total",
    cta: "Grab Deal",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=75",
  },
  {
    id: 3,
    tag: "Flash Sale",
    tagColor: "#ff8f6a",
    tagBg: "rgba(255,143,106,0.10)",
    tagBorder: "rgba(255,143,106,0.28)",
    glowColor: "rgba(255,143,106,0.14)",
    borderAccent: "#ff8f6a",
    badge: "⚡",
    title: "Lunch Flash — Flat ৳50 Off",
    description:
      "Every weekday from 12 PM to 3 PM, get ৳50 off any order over ৳199. Fuel your midday break without breaking the bank.",
    discount: "৳50",
    discountSub: "Lunch Hours",
    cta: "Claim Offer",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=75",
  },
];

const HIGHLIGHT_FEATURES = [
  {
    Icon: FaTruck,
    accent: "#63e6be",
    iconBg: "rgba(99,230,190,0.12)",
    title: "Free Delivery",
    sub: "On orders above ৳299",
  },
  {
    Icon: FaClock,
    accent: "#ffd166",
    iconBg: "rgba(255,209,102,0.12)",
    title: "30-Min Delivery",
    sub: "Average delivery time",
  },
  {
    Icon: FaPercent,
    accent: "#ff8f6a",
    iconBg: "rgba(255,143,106,0.12)",
    title: "Daily Deals",
    sub: "Fresh offers every day",
  },
  {
    Icon: FaBolt,
    accent: "#a78bfa",
    iconBg: "rgba(167,139,250,0.12)",
    title: "Live Tracking",
    sub: "Real-time order updates",
  },
];

const Offers = () => {
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
          {OFFER_CARDS.map((offer) => (
            <article
              key={offer.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(2,8,20,0.5)]"
              style={{ borderTopColor: offer.borderAccent, borderTopWidth: 3 }}
            >
              {/* glow blob */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: offer.glowColor }}
              />

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,14,27,0.1),rgba(9,14,27,0.65))]" />

                {/* discount badge */}
                <div className="absolute bottom-3 right-3 flex flex-col items-center justify-center rounded-xl bg-[rgba(9,14,27,0.88)] px-3 py-2 text-center backdrop-blur-sm border border-[rgba(255,255,255,0.08)]">
                  <span
                    className="text-xl font-black leading-none"
                    style={{ color: offer.borderAccent }}
                  >
                    {offer.discount}
                  </span>
                  <span className="mt-0.5 text-[0.62rem] font-semibold text-[#9ba5be]">
                    {offer.discountSub}
                  </span>
                </div>

                {/* tag */}
                <div
                  className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold backdrop-blur-sm"
                  style={{
                    color: offer.tagColor,
                    background: offer.tagBg,
                    borderColor: offer.tagBorder,
                  }}
                >
                  <span>{offer.badge}</span>
                  {offer.tag}
                </div>
              </div>

              {/* Content */}
              <div className="relative flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <div>
                  <h3 className="text-base font-extrabold leading-snug text-[#eef2ff]">
                    {offer.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#8897b5]">
                    {offer.description}
                  </p>
                </div>

                <button
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, ${offer.borderAccent}, ${offer.borderAccent}cc)`,
                    color: offer.id === 1 ? "#071510" : "#071510",
                    boxShadow: `0 10px 22px ${offer.glowColor}`,
                  }}
                >
                  {offer.cta}
                  <FaArrowRightLong size={12} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Highlight feature strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {HIGHLIGHT_FEATURES.map(
            ({ Icon: FeatureIcon, accent, iconBg, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-3.5 shadow-[0_8px_20px_rgba(2,8,20,0.28)] sm:p-4"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ color: accent, background: iconBg }}
                >
                  <FeatureIcon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#eef2ff]">
                    {title}
                  </p>
                  <p className="text-[0.7rem] text-[#8897b5]">{sub}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default Offers;
