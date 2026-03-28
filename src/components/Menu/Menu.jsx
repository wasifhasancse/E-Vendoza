import { use } from "react";
import { FaArrowRightLong, FaBowlFood, FaStar } from "react-icons/fa6";

const Menu = ({ getCategoriesPromise }) => {
  const getCategoriesData = use(getCategoriesPromise);
  const categoriesData = getCategoriesData?.categories ?? [];

  return (
    <section className="relative py-14 sm:py-16 md:py-20 bg-[radial-gradient(circle_at_10%_8%,#151f35_0%,#0d1426_42%,#090f1c_86%)]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#2b3654] bg-[linear-gradient(120deg,rgba(16,23,40,0.94),rgba(12,18,32,0.9))] shadow-[0_16px_36px_rgba(2,8,20,0.35)] p-4 md:p-5">
          <p className="text-[#ff9a76] tracking-[0.22em] text-xs font-extrabold">
            POPULAR CATEGORIES
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-[#f1f5ff] text-[1.8rem] sm:text-[2.1rem] md:text-[2.45rem] leading-[1.15] font-black">
              Pick Your Favorite
              <br />
              Food Category
            </h2>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#35507a] bg-[rgba(15,24,42,0.7)] px-4 py-2.5 font-bold text-[#d4def5] transition duration-200 hover:-translate-y-0.5 hover:border-[#63e6be] hover:text-[#63e6be]">
              View all
              <FaArrowRightLong />
            </button>
          </div>
        </div>

        {categoriesData.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#3a4666] p-5 text-center text-[#a6b1cd]">
            No categories available right now.
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {categoriesData.map((category) => {
              const shortDescription =
                category?.strCategoryDescription?.slice(0, 95)?.trim() ||
                "Delicious meals crafted with quality ingredients and bold flavors.";

              return (
                <article
                  key={category?.idCategory}
                  className="overflow-hidden rounded-[1.1rem] border border-[#2f3b5a] bg-[linear-gradient(180deg,rgba(17,25,43,0.96),rgba(12,19,33,0.96))] shadow-[0_12px_26px_rgba(2,8,20,0.34)] transition duration-300 hover:-translate-y-1.5 hover:border-[#4d628f] hover:shadow-[0_22px_38px_rgba(2,8,20,0.5)]"
                >
                  <div className="relative p-[0.95rem] pb-0">
                    <img
                      src={category?.strCategoryThumb}
                      alt={category?.strCategory || "Category image"}
                      className="w-full aspect-4/3 object-cover rounded-xl border border-[#36415f] bg-[#151d30]"
                      loading="lazy"
                    />
                    <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-[#35405e] bg-[rgba(7,12,24,0.78)] px-2.5 py-1 text-[0.72rem] font-bold text-[#e8eeff]">
                      <FaStar className="text-[#ffd166]" />
                      Top Choice
                    </span>
                  </div>

                  <div className="p-4 md:p-5">
                    <p className="inline-flex items-center gap-1.5 text-[0.77rem] font-bold text-[#8dd6ff]">
                      <FaBowlFood />
                      Fresh Category
                    </p>

                    <h3 className="mt-2 text-[1.25rem] leading-[1.2] font-extrabold text-[#f2f6ff]">
                      {category?.strCategory}
                    </h3>
                    <p className="mt-2 text-[#a8b2cd] leading-relaxed min-h-18.5 sm:min-h-21 xl:min-h-18.5">
                      {shortDescription}...
                    </p>

                    <button className="mt-3.5 inline-flex items-center gap-2 font-bold text-[#63e6be] transition duration-200 hover:translate-x-1 hover:text-[#7cecc8]">
                      Explore
                      <FaArrowRightLong />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
