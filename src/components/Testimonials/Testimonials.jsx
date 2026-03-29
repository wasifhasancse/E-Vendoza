import { FaQuoteLeft, FaStar } from "react-icons/fa6";
import usePublicJson from "../../hooks/usePublicJson";

const FALLBACK_TESTIMONIALS = {
  meta: {
    eyebrow: "Customer Reviews",
    titleLineOne: "What Our Customers",
    titleHighlight: "Are Saying",
    ratingText: "4.9 / 5.0",
    reviewCount: "12,500+ Reviews",
  },
  cta: {
    title: "Join 50,000+ happy customers",
    description:
      "Order today and leave your own review. Your feedback makes us better every day.",
    buttonText: "Order & Review",
  },
  reviews: [],
};

const normalizeRating = (rating) => {
  const number = Number(rating);
  if (Number.isNaN(number)) return 5;
  return Math.max(0, Math.min(5, Math.round(number)));
};

const StarRow = ({ rating }) =>
  Array.from({ length: 5 }).map((_, i) => (
    <FaStar
      key={i}
      size={12}
      className={i < rating ? "text-[#ffd166]" : "text-[#2b3d5e]"}
    />
  ));

const Testimonials = () => {
  const testimonialsData = usePublicJson(
    "/data/testimonials.json",
    FALLBACK_TESTIMONIALS,
  );
  const meta = testimonialsData?.meta ?? FALLBACK_TESTIMONIALS.meta;
  const cta = testimonialsData?.cta ?? FALLBACK_TESTIMONIALS.cta;
  const reviews = (
    Array.isArray(testimonialsData?.reviews)
      ? testimonialsData.reviews
      : FALLBACK_TESTIMONIALS.reviews
  ).map((review, index) => ({
    id: review?.id ?? `review-${index + 1}`,
    name: review?.name ?? "Customer",
    role: review?.role ?? "Verified Customer",
    avatar:
      review?.avatar ??
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: normalizeRating(review?.rating),
    title: review?.title ?? "Great service",
    body: review?.body ?? "Had a great ordering and delivery experience.",
    tag: review?.tag ?? "Verified",
    accentColor: review?.accentColor ?? "#63e6be",
  }));

  return (
    <section
      id="testimonials-section"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_80%,#1b2235_0%,#11182a_36%,#0a0f1c_76%)] py-14 sm:py-16 md:py-20"
    >
      {/* blobs */}
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-[50px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.1)_0%,transparent_70%)] blur-[50px]" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div className="rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 md:p-5 shadow-[0_16px_36px_rgba(2,8,20,0.35)]">
          <p className="text-[#ff8f6a] tracking-[0.24em] text-xs font-extrabold uppercase">
            {meta.eyebrow}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-[#f5f7ff] text-[1.8rem] sm:text-[2.1rem] md:text-[2.45rem] leading-[1.15] font-black">
              {meta.titleLineOne}
              <br />
              <span className="bg-[linear-gradient(130deg,#ff8f6a_15%,#ffd166_85%)] bg-clip-text text-transparent">
                {meta.titleHighlight}
              </span>
            </h2>

            {/* aggregate rating pill */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[#1c2b43] bg-[rgba(10,16,30,0.7)] px-4 py-2.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} size={14} className="text-[#ffd166]" />
                ))}
              </div>
              <div>
                <p className="text-sm font-black text-[#f5f7ff]">
                  {meta.ratingText}
                </p>
                <p className="text-[0.68rem] text-[#8897b5]">
                  {meta.reviewCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review grid */}
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 md:gap-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="mb-5 break-inside-avoid rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 shadow-[0_10px_26px_rgba(2,8,20,0.3)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(2,8,20,0.48)] sm:p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-2"
                    style={{ ringColor: review.accentColor + "40" }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#eef2ff]">
                      {review.name}
                    </p>
                    <p className="truncate text-[0.68rem] text-[#8897b5]">
                      {review.role}
                    </p>
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-bold"
                  style={{
                    color: review.accentColor,
                    borderColor: review.accentColor + "40",
                    background: review.accentColor + "12",
                  }}
                >
                  {review.tag}
                </span>
              </div>

              {/* Stars */}
              <div className="mt-3 flex items-center gap-0.5">
                <StarRow rating={review.rating} />
              </div>

              {/* Quote icon + body */}
              <div className="relative mt-3">
                <FaQuoteLeft
                  size={18}
                  className="mb-1.5 opacity-20"
                  style={{ color: review.accentColor }}
                />
                <p className="text-sm font-bold leading-snug text-[#eef2ff]">
                  {review.title}
                </p>
                <p className="mt-1.5 text-[0.83rem] leading-relaxed text-[#8897b5]">
                  {review.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#1e2d48] bg-[linear-gradient(135deg,rgba(16,24,44,0.95),rgba(9,14,27,0.95))] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-extrabold text-[#f5f7ff]">{cta.title}</p>
            <p className="mt-0.5 text-sm text-[#8897b5]">{cta.description}</p>
          </div>
          <button className="shrink-0 rounded-full bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] px-7 py-3 text-sm font-black text-[#071510] shadow-[0_8px_22px_rgba(99,230,190,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110">
            {cta.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
