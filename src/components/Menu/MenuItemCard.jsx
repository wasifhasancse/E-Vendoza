import { FaArrowRightLong, FaBowlFood, FaFire, FaStar } from "react-icons/fa6";

const MenuItemCard = ({ categoriesData, setSelectedCategory, isActive }) => {
  const manageMenuExplore = () => {
    setSelectedCategory(categoriesData.strCategory);
    // Small delay lets React re-render the food list before scrolling
    setTimeout(() => {
      document
        .getElementById("menu-items-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <article
      onClick={manageMenuExplore}
      className={`group relative flex flex-col rounded-2xl border cursor-pointer bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(2,8,20,0.5)] ${
        isActive
          ? "border-[#63e6be] shadow-[0_18px_36px_rgba(99,230,190,0.22)]"
          : "border-[#1c2b43] hover:border-[#2e4a6e]"
      }`}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-3xl transition-transform duration-500 group-hover:scale-125" />

      {/* ── Image block (overflow contained here only) ── */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={categoriesData?.strCategoryThumb}
          alt={categoriesData?.strCategory || "Category image"}
          className="w-full aspect-4/3 object-cover bg-[#0d1424] transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Bottom gradient fade */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,14,27,0.75)_0%,transparent_55%)]" />

        {/* Active ring overlay */}
        {isActive && (
          <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-2 ring-inset ring-[#63e6be]/35" />
        )}

        {/* Top-left: Top Choice badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-[#2f354a] bg-[rgba(15,20,38,0.88)] px-2.5 py-1 text-[0.68rem] font-bold text-[#d5ddf5] backdrop-blur-sm shadow-[0_0_16px_rgba(255,209,102,0.07)]">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,209,102,0.1),transparent_70%)] animate-pulse" />
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#ffd166] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff8f6a]" />
          </span>
          <FaStar className="relative text-[#ffd166]" size={10} />
          <span className="relative">Top Choice</span>
        </span>

        {/* Bottom-right: state pill */}
        <span
          className={`absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.67rem] font-extrabold backdrop-blur-sm border transition-all duration-300 ${
            isActive
              ? "bg-[rgba(99,230,190,0.18)] border-[#63e6be]/55 text-[#63e6be]"
              : "bg-[rgba(9,14,27,0.80)] border-[#1c2b43] text-[#8897b5] group-hover:border-[#63e6be]/40 group-hover:text-[#63e6be]"
          }`}
        >
          <FaFire
            size={9}
            className={isActive ? "text-[#63e6be]" : "text-[#ff9a76]"}
          />
          {isActive ? "Selected" : "Explore"}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {/* Category eyebrow */}
        <p className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold text-[#ff8f6a]">
          <FaBowlFood size={12} />
          Fresh Category
        </p>

        {/* Title */}
        <h3 className="mt-2 text-[1.15rem] leading-tight font-extrabold text-[#eef2ff] line-clamp-1">
          {categoriesData?.strCategory}
        </h3>

        {/* Description — fixed height so cards stay uniform */}
        <p className="mt-2 text-[#8897b5] leading-relaxed text-[0.87rem] line-clamp-2 min-h-[2.6rem]">
          {categoriesData?.strCategoryDescription?.slice(0, 90)?.trim() ||
            "Delicious meals crafted with quality ingredients."}
          …
        </p>

        {/* Divider */}
        <div className="mt-4 border-t border-[#1a2a40]" />

        {/* Footer row — stable layout, no size shift on active */}
        <div className="mt-3.5 flex items-center justify-between gap-2">
          <span
            className={`text-[0.7rem] font-semibold transition-colors duration-200 ${
              isActive
                ? "text-[#63e6be]"
                : "text-[#5e6f94] group-hover:text-[#7d8aa8]"
            }`}
          >
            {isActive ? "✓ Viewing now" : "Tap to explore"}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              manageMenuExplore();
            }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.73rem] font-black border transition-all duration-200 ${
              isActive
                ? "bg-[rgba(99,230,190,0.14)] text-[#63e6be] border-[#63e6be]/50"
                : "bg-[rgba(16,24,42,0.85)] text-[#63e6be] border-[#2b3d5e] hover:border-[#63e6be]/55 hover:bg-[rgba(99,230,190,0.07)]"
            }`}
          >
            {isActive ? "Selected" : "Explore"}
            <FaArrowRightLong
              size={11}
              className={`transition-transform duration-200 ${!isActive && "group-hover:translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;
