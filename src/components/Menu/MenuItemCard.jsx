import { FaArrowRightLong, FaBowlFood, FaStar } from "react-icons/fa6";

const MenuItemCard = ({ categoriesData, setSelectedCategory, isActive }) => {
  // console.log(categoriesData);
  const manageMenuExplore = () => {
    setSelectedCategory(categoriesData.strCategory);
  };

  return (
    <div>
      <article
        key={categoriesData?.idCategory}
        className={`relative overflow-hidden rounded-2xl border bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] shadow-[0_12px_30px_rgba(2,8,20,0.32)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(2,8,20,0.48)] ${
          isActive
            ? "border-[#63e6be] shadow-[0_18px_36px_rgba(99,230,190,0.14)]"
            : "border-[#1c2b43] hover:border-[#3d5480]"
        }`}
      >
        <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="relative p-[0.95rem] pb-0">
          <img
            src={categoriesData?.strCategoryThumb}
            alt={categoriesData?.strCategory || "Category image"}
            className="w-full aspect-4/3 object-cover rounded-xl border border-[#1c2b43] bg-[#0d1424]"
            loading="lazy"
          />
          <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-[#2f354a] bg-[#1a2035] px-2.5 py-1 text-[0.72rem] font-bold text-[#d5ddf5] shadow-[0_0_18px_rgba(255,209,102,0.08)]">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,209,102,0.12),transparent_72%)] animate-pulse" />
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#ffd166] opacity-70 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff8f6a]" />
            </span>
            <FaStar className="relative text-[#ffd166]" />
            <span className="relative">Top Choice</span>
          </span>
        </div>

        <div className="p-4 md:p-5">
          <p className="inline-flex items-center gap-1.5 text-[0.77rem] font-bold text-[#ff8f6a]">
            <FaBowlFood />
            Fresh Category
          </p>

          <h3 className="mt-2 text-[1.25rem] leading-[1.2] font-extrabold text-[#eef2ff]">
            {categoriesData?.strCategory}
          </h3>
          <p className="mt-2 text-[#8897b5] leading-relaxed min-h-18.5 sm:min-h-21 xl:min-h-18.5">
            {categoriesData?.strCategoryDescription?.slice(0, 95)?.trim() ||
              "Delicious meals crafted with quality ingredients and bold flavors."}
            ...
          </p>

          <button
            onClick={manageMenuExplore}
            className={`mt-3.5 inline-flex items-center gap-2 font-bold transition duration-200 hover:translate-x-0.5 ${
              isActive
                ? "text-[#7cecc8]"
                : "text-[#63e6be] hover:text-[#7cecc8]"
            }`}
          >
            {isActive ? "Selected" : "Explore"}
            <FaArrowRightLong />
          </button>
        </div>
      </article>
    </div>
  );
};

export default MenuItemCard;
