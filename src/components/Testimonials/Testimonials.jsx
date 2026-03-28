import { FaQuoteLeft, FaStar } from "react-icons/fa6";

const REVIEWS = [
  {
    id: 1,
    name: "Fatema Khanam",
    role: "Regular Customer · Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Fastest delivery in town!",
    body: "I ordered during peak hours and the food was still at my door in under 30 minutes, piping hot. The tracking feature is a game-changer — I could see exactly where my rider was!",
    tag: "Verified Order",
    accentColor: "#63e6be",
  },
  {
    id: 2,
    name: "Rahim Uddin",
    role: "Food Enthusiast · Chittagong",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Great variety, zero hassle",
    body: "The category filter makes it so easy to find exactly what I'm craving. Found a hidden gem biryani place I never knew existed. The packaging was spotless — will 100% reorder.",
    tag: "Top Reviewer",
    accentColor: "#ffd166",
  },
  {
    id: 3,
    name: "Lamia Sultana",
    role: "Working Professional · Sylhet",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "My daily lunch partner",
    body: "I order lunch every weekday. The weekend 20% deal saves me a ton each month. App is smooth, payment with bKash is instant, and customer support actually responds in minutes.",
    tag: "Daily Customer",
    accentColor: "#ff8f6a",
  },
  {
    id: 4,
    name: "Arif Hossain",
    role: "Student · Rajshahi",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Super affordable for students",
    body: "Free first delivery and daily promo codes keep my food budget in check. The portions are generous and the food quality matches the restaurant photos — no disappointment at all.",
    tag: "Verified Order",
    accentColor: "#a78bfa",
  },
  {
    id: 5,
    name: "Nusrat Jahan",
    role: "Homemaker · Comilla",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Even my kids love placing orders",
    body: "The interface is so simple that my 10-year-old can browse and pick a meal without help. The live order card on the homepage is a brilliant touch — very visual and fun to use.",
    tag: "Family User",
    accentColor: "#63e6be",
  },
  {
    id: 6,
    name: "Shakil Ahmed",
    role: "Software Engineer · Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Best payment integration",
    body: "I appreciate that Nagad and Rocket are supported alongside bKash. The checkout flow is clean and fast — I've never had a failed transaction. Great work on the tech side too!",
    tag: "Power User",
    accentColor: "#ff8f6a",
  },
];

const StarRow = ({ rating }) =>
  Array.from({ length: 5 }).map((_, i) => (
    <FaStar
      key={i}
      size={12}
      className={i < rating ? "text-[#ffd166]" : "text-[#2b3d5e]"}
    />
  ));

const Testimonials = () => {
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
            Customer Reviews
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-[#f5f7ff] text-[1.8rem] sm:text-[2.1rem] md:text-[2.45rem] leading-[1.15] font-black">
              What Our Customers
              <br />
              <span className="bg-[linear-gradient(130deg,#ff8f6a_15%,#ffd166_85%)] bg-clip-text text-transparent">
                Are Saying
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
                <p className="text-sm font-black text-[#f5f7ff]">4.9 / 5.0</p>
                <p className="text-[0.68rem] text-[#8897b5]">12,500+ Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review grid */}
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 md:gap-6 [column-fill:balance]">
          {REVIEWS.map((review) => (
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
            <p className="text-lg font-extrabold text-[#f5f7ff]">
              Join 50,000+ happy customers
            </p>
            <p className="mt-0.5 text-sm text-[#8897b5]">
              Order today and leave your own review. Your feedback makes us
              better every day.
            </p>
          </div>
          <button className="shrink-0 rounded-full bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] px-7 py-3 text-sm font-black text-[#071510] shadow-[0_8px_22px_rgba(99,230,190,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110">
            Order &amp; Review
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
