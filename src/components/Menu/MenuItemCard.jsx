import { FaArrowRightLong, FaBowlFood, FaStar } from "react-icons/fa6";

const MenuItemCard = ({ categoriesData }) => {
  console.log("Fetched categories data:", categoriesData);

  return (
    <div>


                <article
                  key={categoriesData?.idCategory}
                  className="overflow-hidden rounded-[1.1rem] border border-[#2f3b5a] bg-[linear-gradient(180deg,rgba(17,25,43,0.96),rgba(12,19,33,0.96))] shadow-[0_12px_26px_rgba(2,8,20,0.34)] transition duration-300 hover:-translate-y-1.5 hover:border-[#4d628f] hover:shadow-[0_22px_38px_rgba(2,8,20,0.5)]"
                >
                  <div className="relative p-[0.95rem] pb-0">
                    <img
                      src={categoriesData?.strCategoryThumb}
                      alt={categoriesData?.strCategory || "Category image"}
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
                      {categoriesData?.strCategory}
                    </h3>
                    <p className="mt-2 text-[#a8b2cd] leading-relaxed min-h-18.5 sm:min-h-21 xl:min-h-18.5">
                      {categoriesData?.strCategoryDescription?.slice(0, 95)?.trim() ||
                "Delicious meals crafted with quality ingredients and bold flavors."}...
                    </p>

                    <button className="mt-3.5 inline-flex items-center gap-2 font-bold text-[#63e6be] transition duration-200 hover:translate-x-1 hover:text-[#7cecc8]">
                      Explore
                      <FaArrowRightLong />
                    </button>
                  </div>
                </article>

          </div>

  );
};

export default MenuItemCard;
