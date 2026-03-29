import {
  FaArrowRightLong,
  FaBagShopping,
  FaCartPlus,
  FaTag,
} from "react-icons/fa6";

const OfferCard = ({ offer, onAddToCart, onBuyNow, onViewDetails }) => {
  const cardMeal = offer.meal ?? {};

  const handleAdd = () => {
    if (!offer?.cartFood) return;
    onAddToCart?.(offer.cartFood, offer.finalPrice, {
      basePrice: offer.basePrice,
      offerType: offer.offerType,
      offerLabel: offer.offerLabel,
    });
  };

  const handleBuy = () => {
    if (!offer?.cartFood) return;
    onBuyNow?.(offer.cartFood, offer.finalPrice, {
      basePrice: offer.basePrice,
      offerType: offer.offerType,
      offerLabel: offer.offerLabel,
    });
  };

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(2,8,20,0.46)]"
      style={{ borderTopColor: offer.borderAccent, borderTopWidth: 3 }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: offer.glowColor }}
      />

      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
        <img
          src={cardMeal.strMealThumb ?? offer.image}
          alt={cardMeal.strMeal ?? offer.title}
          className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,14,27,0.12),rgba(9,14,27,0.68))]" />

        <div className="absolute bottom-3 right-3 flex flex-col items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(9,14,27,0.88)] px-3 py-2 text-center backdrop-blur-sm">
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

      <div className="relative flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="text-base font-extrabold leading-snug text-[#eef2ff]">
            {cardMeal.strMeal ?? offer.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#8897b5]">
            {cardMeal.strCategory
              ? `${cardMeal.strCategory} cuisine from ${cardMeal.strArea || "global"}.`
              : offer.description}
          </p>
          <div className="mt-2.5 inline-flex items-center rounded-full border border-[rgba(99,230,190,0.22)] bg-[rgba(99,230,190,0.08)] px-2.5 py-1 text-xs font-bold text-[#63e6be]">
            {offer.offerLabel}
          </div>
        </div>

        {/* Price display */}
        <div className="flex items-center justify-between rounded-xl border border-[#1c2b43] bg-[rgba(10,16,30,0.5)] px-3.5 py-2.5">
          <div className="flex flex-col">
            <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-[#5e6f94]">
              Offer Price
            </span>
            <span
              className="mt-0.5 text-[1.25rem] font-black leading-none"
              style={{ color: offer.borderAccent }}
            >
              {offer.finalPrice === 0 ? "FREE" : `৳${offer.finalPrice}`}
            </span>
          </div>

          {offer.basePrice !== offer.finalPrice && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-[#5e6f94]">
                Regular Price
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#7d8aa8] line-through">
                  ৳{offer.basePrice}
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-extrabold"
                  style={{
                    color: offer.borderAccent,
                    background: `${offer.glowColor}`,
                    border: `1px solid ${offer.borderAccent}44`,
                  }}
                >
                  <FaTag size={8} />
                  {offer.discount}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2b3d5e] bg-[rgba(10,16,30,0.72)] py-2.5 text-xs font-bold text-[#c8d3eb] transition-all duration-200 hover:border-[#63e6be] hover:text-[#63e6be]"
          >
            <FaCartPlus size={12} />
            Add to Cart
          </button>

          <button
            onClick={handleBuy}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-[#071510] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${offer.borderAccent}, ${offer.borderAccent}cc)`,
              boxShadow: `0 10px 22px ${offer.glowColor}`,
            }}
          >
            <FaBagShopping size={12} />
            Buy Now
          </button>
        </div>

        <button
          onClick={() => onViewDetails?.(offer)}
          className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8897b5] transition-colors hover:text-[#eef2ff]"
        >
          View details
          <FaArrowRightLong size={11} />
        </button>
      </div>
    </article>
  );
};

export default OfferCard;
