import { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaBolt,
  FaCartShopping,
  FaGear,
  FaHeart,
  FaMagnifyingGlass,
  FaMinus,
  FaPlus,
  FaRightFromBracket,
  FaTrash,
  FaUser,
  FaXmark,
} from "react-icons/fa6";

const NAV_LINKS = ["Home", "Menu", "Food", "About"];

const NavBar = ({
  addToCartItems,
  favoriteItems,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
  onRemoveFavorite,
  onAddToCart,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navRef = useRef(null);

  const totalItems = addToCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const subtotal = addToCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = totalItems > 0 ? 60 : 0;
  const totalPrice = subtotal + deliveryFee;
  const totalFavorites = favoriteItems.length;

  const closeAllPanels = () => {
    setMenuOpen(false);
    setCartOpen(false);
    setFavoriteOpen(false);
    setUserOpen(false);
    setMobileSearchOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAllPanels();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-[#1c2b43] bg-[rgba(9,14,28,0.92)] backdrop-blur-md"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          <a className="shrink-0 inline-flex items-center gap-2 cursor-pointer">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] text-[#061510] shadow-[0_4px_14px_rgba(99,230,190,0.38)]">
              <FaBolt size={14} />
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-black bg-[linear-gradient(130deg,#f5f7ff_40%,#63e6be_100%)] bg-clip-text text-transparent">
              E-Vendoza
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link}>
                <a
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    i === 0
                      ? "text-[#63e6be] bg-[rgba(99,230,190,0.08)]"
                      : "text-[#8897b5] hover:text-[#f5f7ff] hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="relative hidden sm:block">
              <FaMagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6f94]"
                size={13}
              />
              <input
                type="text"
                placeholder="Search food..."
                className="rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] pl-9 pr-4 py-2 text-sm text-[#c8d3eb] placeholder:text-[#5e6f94] outline-none transition-all w-40 md:w-52 hover:border-[#32507a] hover:shadow-[0_0_0_3px_rgba(99,230,190,0.08)] focus:border-[#63e6be] focus:shadow-[0_0_0_3px_rgba(99,230,190,0.14)]"
              />
            </div>

            <div className="relative">
              <button
                className="relative hidden lg:inline-flex items-center gap-2 rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] px-3 py-2 text-sm font-semibold text-[#c8d3eb] transition-all hover:border-[#63e6be] hover:text-[#63e6be] hover:shadow-[0_0_0_3px_rgba(99,230,190,0.08)]"
                onClick={() => {
                  setFavoriteOpen((prev) => !prev);
                  setCartOpen(false);
                  setMenuOpen(false);
                  setUserOpen(false);
                  setMobileSearchOpen(false);
                }}
                aria-label="Favorites"
              >
                <FaHeart size={14} />
                Favorites
                {totalFavorites > 0 && (
                  <span className="ml-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#ff8f6a] px-1 text-[0.58rem] font-black text-[#071510]">
                    {totalFavorites}
                  </span>
                )}
              </button>

              <button
                className="relative hidden sm:grid lg:hidden h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#ff8f6a] hover:text-[#ff8f6a] transition-colors"
                onClick={() => {
                  setFavoriteOpen((prev) => !prev);
                  setCartOpen(false);
                  setMenuOpen(false);
                  setUserOpen(false);
                  setMobileSearchOpen(false);
                }}
                aria-label="Toggle favorites"
              >
                <FaHeart size={14} />
                {totalFavorites > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#ff8f6a] px-1 text-[0.58rem] font-black text-[#071510]">
                    {totalFavorites}
                  </span>
                )}
              </button>

              <button
                className="relative grid h-9 w-9 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#ff8f6a] hover:text-[#ff8f6a] transition-colors sm:hidden"
                onClick={() => {
                  setFavoriteOpen((prev) => !prev);
                  setCartOpen(false);
                  setMenuOpen(false);
                  setUserOpen(false);
                  setMobileSearchOpen(false);
                }}
                aria-label="Toggle favorites"
              >
                <FaHeart size={14} />
                {totalFavorites > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#ff8f6a] px-1 text-[0.58rem] font-black text-[#071510]">
                    {totalFavorites}
                  </span>
                )}
              </button>

              {favoriteOpen && (
                <div className="fixed left-1/2 top-18 z-70 w-[min(21rem,calc(100vw-1.25rem))] -translate-x-1/2 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 shadow-[0_20px_40px_rgba(2,8,20,0.55)] sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:mt-2 sm:w-72 sm:translate-x-0">
                  <p className="text-[#f5f7ff] text-base font-bold">
                    Favorites
                  </p>
                  <p className="mt-1 text-sm text-[#8897b5]">
                    {totalFavorites} item{totalFavorites === 1 ? "" : "s"} saved
                  </p>

                  {favoriteItems.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-[#2b3d5e] bg-[rgba(10,16,30,0.45)] px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-[#c8d3eb]">
                        No favorites yet
                      </p>
                      <p className="mt-1 text-xs text-[#8897b5]">
                        Tap the heart icon on meals to save them here.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-3 max-h-62 space-y-2.5 overflow-y-auto pr-1">
                        {favoriteItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-[#233453] bg-[rgba(10,16,30,0.65)] p-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[#eef2ff]">
                                  {item.name}
                                </p>
                                <p className="text-xs font-semibold text-[#63e6be]">
                                  ৳{item.price}
                                </p>
                              </div>
                              <button
                                onClick={() => onRemoveFavorite(item.id)}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-[#2b3d5e] text-[#ff9a76] transition-colors hover:border-[#ff9a76]"
                                aria-label="Remove favorite"
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                onAddToCart(
                                  {
                                    idMeal: item.id,
                                    strMeal: item.name,
                                    strMealThumb: item.image,
                                  },
                                  item.price,
                                )
                              }
                              className="mt-2.5 w-full rounded-lg bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] py-2 text-sm font-bold text-[#071510]"
                            >
                              Add to Cart
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="sm:hidden grid h-9 w-9 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-colors"
              onClick={() => {
                setMobileSearchOpen((prev) => !prev);
                setMenuOpen(false);
                setCartOpen(false);
                setFavoriteOpen(false);
                setUserOpen(false);
              }}
              aria-label="Toggle search"
            >
              <FaMagnifyingGlass size={15} />
            </button>

            <div className="relative">
              <button
                className="relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-colors"
                onClick={() => {
                  setCartOpen((prev) => !prev);
                  setFavoriteOpen(false);
                  setUserOpen(false);
                  setMenuOpen(false);
                  setMobileSearchOpen(false);
                }}
                aria-label="Toggle cart menu"
              >
                <FaCartShopping size={16} />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#63e6be] px-1 text-[0.58rem] font-black text-[#061510]">
                    {totalItems}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="fixed left-1/2 top-18 z-70 w-[min(21rem,calc(100vw-1.25rem))] -translate-x-1/2 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 shadow-[0_20px_40px_rgba(2,8,20,0.55)] sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:mt-2 sm:w-72 sm:translate-x-0">
                  <p className="text-[#f5f7ff] text-base font-bold">
                    Your Cart
                  </p>
                  <p className="mt-1 text-sm text-[#8897b5]">
                    {totalItems} item{totalItems === 1 ? "" : "s"} selected
                  </p>

                  {addToCartItems.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-[#2b3d5e] bg-[rgba(10,16,30,0.45)] px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-[#c8d3eb]">
                        Your cart is empty
                      </p>
                      <p className="mt-1 text-xs text-[#8897b5]">
                        Add meals from the menu to see them here.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-3 max-h-62 space-y-2.5 overflow-y-auto pr-1">
                        {addToCartItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-[#233453] bg-[rgba(10,16,30,0.65)] p-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[#eef2ff]">
                                  {item.name}
                                </p>
                                <p className="text-xs font-semibold text-[#63e6be]">
                                  ৳{item.price} each
                                </p>
                              </div>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-[#2b3d5e] text-[#ff9a76] transition-colors hover:border-[#ff9a76]"
                                aria-label="Remove item"
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-lg border border-[#2b3d5e] bg-[rgba(16,24,42,0.7)]">
                                <button
                                  onClick={() => onDecreaseQty(item.id)}
                                  className="grid h-8 w-8 place-items-center text-[#c8d3eb] hover:text-[#63e6be]"
                                  aria-label="Decrease quantity"
                                >
                                  <FaMinus size={10} />
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-[#eef2ff]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onIncreaseQty(item.id)}
                                  className="grid h-8 w-8 place-items-center text-[#c8d3eb] hover:text-[#63e6be]"
                                  aria-label="Increase quantity"
                                >
                                  <FaPlus size={10} />
                                </button>
                              </div>

                              <p className="text-sm font-bold text-[#63e6be]">
                                ৳{item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 space-y-1.5 border-t border-[#1c2b43] pt-3 text-sm text-[#c8d3eb]">
                        <div className="flex items-center justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold">৳{subtotal}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Delivery Fee</span>
                          <span className="font-semibold">৳{deliveryFee}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between border-t border-[#1c2b43] pt-2">
                          <span className="font-bold text-[#eef2ff]">
                            Total
                          </span>
                          <span className="font-bold text-[#63e6be]">
                            ৳{totalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button className="rounded-xl border border-[#2b3d5e] py-2 text-sm font-semibold text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-colors">
                          View Cart
                        </button>
                        <button className="rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] py-2 text-sm font-bold text-[#071510]">
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-[#63e6be]/30 hover:ring-[#63e6be]/60 transition-all"
                onClick={() => {
                  setUserOpen((prev) => !prev);
                  setCartOpen(false);
                  setFavoriteOpen(false);
                  setMenuOpen(false);
                  setMobileSearchOpen(false);
                }}
                aria-label="Toggle user menu"
              >
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 z-70 mt-2 w-[min(14rem,calc(100vw-1.5rem))] rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-2 shadow-[0_20px_40px_rgba(2,8,20,0.55)]">
                  <button className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#c8d3eb] hover:bg-[rgba(255,255,255,0.05)]">
                    <FaUser size={13} />
                    Profile
                  </button>
                  <button className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#c8d3eb] hover:bg-[rgba(255,255,255,0.05)]">
                    <FaGear size={13} />
                    Settings
                  </button>
                  <button className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#ff9a76] hover:bg-[rgba(255,154,118,0.08)]">
                    <FaRightFromBracket size={13} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              className="lg:hidden grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-colors"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setCartOpen(false);
                setFavoriteOpen(false);
                setUserOpen(false);
                setMobileSearchOpen(false);
              }}
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? <FaXmark size={18} /> : <FaBars size={16} />}
            </button>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="sm:hidden border-t border-[#1c2b43] bg-[rgba(9,14,28,0.98)]">
          <div className="container mx-auto px-4 py-3">
            <div className="relative">
              <FaMagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6f94]"
                size={13}
              />
              <input
                type="text"
                placeholder="Search food..."
                className="w-full rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] pl-9 pr-4 py-2.5 text-sm text-[#c8d3eb] placeholder:text-[#5e6f94] outline-none transition-all hover:border-[#32507a] focus:border-[#63e6be] focus:shadow-[0_0_0_3px_rgba(99,230,190,0.14)]"
              />
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-[#1c2b43] bg-[rgba(9,14,28,0.98)] shadow-[0_18px_34px_rgba(2,8,20,0.45)]">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, i) => (
                <li key={link}>
                  <button
                    className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      i === 0
                        ? "text-[#63e6be] bg-[rgba(99,230,190,0.08)]"
                        : "text-[#8897b5] hover:text-[#f5f7ff] hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
