import { use } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import MenuItemCard from "./MenuItemCard";

const Menu = ({ getCategoriesPromise }) => {
  const getCategoriesData = use(getCategoriesPromise);
  const allCategoriesData = getCategoriesData.categories;

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

        {allCategoriesData.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#3a4666] p-5 text-center text-[#a6b1cd]">
            No categories available right now.
          </div>
        ) : (
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">{
              allCategoriesData.map((categoriesData) => (
                <MenuItemCard
                  key={categoriesData.idCategory}
                  categoriesData={categoriesData}
                />
              ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
