import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaBars,
  FaBolt,
  FaCartShopping,
  FaCheck,
  FaCircleCheck,
  FaCopy,
  FaGear,
  FaHeart,
  FaMagnifyingGlass,
  FaMinus,
  FaPlus,
  FaRightFromBracket,
  FaSpinner,
  FaTrash,
  FaUser,
  FaXmark,
} from "react-icons/fa6";

const NAV_LINKS = ["Home", "Menu", "Food", "About"];

const NavBar = ({
  addToCartItems,
  favoriteItems,
  categories,
  selectedCategory,
  onSelectCategory,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
  onRemoveFavorite,
  onAddToCart,
  onClearCart,
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "Cash on Delivery",
    paymentProvider: "Visa / MasterCard",
    paymentAccount: "",
    paymentNote: "",
  });
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderNumberCopied, setOrderNumberCopied] = useState(false);
  const navRef = useRef(null);
  const orderNumberCopyTimerRef = useRef(null);
  const clearCartTimerRef = useRef(null);
  const allCategories = categories ?? [];

  const totalItems = addToCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const subtotal = addToCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const originalSubtotal = addToCartItems.reduce(
    (sum, item) => sum + (item.basePrice ?? item.price) * item.quantity,
    0,
  );
  const savings = Math.max(0, originalSubtotal - subtotal);
  const deliveryFee = totalItems > 0 ? 60 : 0;
  const totalPrice = subtotal + deliveryFee;
  const totalFavorites = favoriteItems.length;

  const closeAllPanels = () => {
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    setCartOpen(false);
    setCheckoutOpen(false);
    setFavoriteOpen(false);
    setUserOpen(false);
    setMobileSearchOpen(false);
  };

  const openCheckout = () => {
    if (addToCartItems.length === 0) return;
    setCheckoutOpen(true);
    setCartOpen(false);
    setFavoriteOpen(false);
    setUserOpen(false);
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setCheckoutErrors({});
    setIsPlacingOrder(false);
    setOrderSuccess(false);
    setOrderNumber(null);
  };

  const closeCheckout = () => {
    if (isPlacingOrder) return;
    setCheckoutOpen(false);
    setCheckoutErrors({});
    if (orderSuccess) {
      setCheckoutForm({
        name: "",
        phone: "",
        address: "",
        payment: "Cash on Delivery",
        paymentProvider: "Visa / MasterCard",
        paymentAccount: "",
        paymentNote: "",
      });
      setOrderSuccess(false);
      setOrderNumber(null);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMenuLinkClick = (link) => {
    if (link === "Menu") {
      setCategoriesOpen((prev) => !prev);
      setCartOpen(false);
      setFavoriteOpen(false);
      setUserOpen(false);
      setMobileSearchOpen(false);
      return;
    }

    setCategoriesOpen(false);
    setCartOpen(false);
    setFavoriteOpen(false);
    setUserOpen(false);
    setMobileSearchOpen(false);

    if (link === "Home") {
      scrollToSection("hero-section");
    }

    if (link === "Food") {
      scrollToSection("menu-items-section");
    }

    if (link === "About") {
      scrollToSection("how-it-works-section");
    }
  };

  const handleCategorySelect = (categoryName) => {
    onSelectCategory?.(categoryName);
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    setCartOpen(false);
    setFavoriteOpen(false);
    setUserOpen(false);
    setMobileSearchOpen(false);
    scrollToSection("menu-items-section");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (checkoutOpen) return;
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAllPanels();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [checkoutOpen]);

  useEffect(() => {
    if (!checkoutOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [checkoutOpen]);

  useEffect(() => {
    const handleOpenCartPanel = () => {
      setCartOpen(true);
      setFavoriteOpen(false);
      setUserOpen(false);
      setCategoriesOpen(false);
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    };

    window.addEventListener("open-cart-panel", handleOpenCartPanel);
    return () => {
      window.removeEventListener("open-cart-panel", handleOpenCartPanel);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (orderNumberCopyTimerRef.current) {
        clearTimeout(orderNumberCopyTimerRef.current);
      }
      if (clearCartTimerRef.current) {
        clearTimeout(clearCartTimerRef.current);
      }
    };
  }, []);

  const handleCheckoutSubmit = () => {
    const errors = {};
    if (!checkoutForm.name.trim()) errors.name = "Full name is required";
    if (!checkoutForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\s()-]{7,16}$/.test(checkoutForm.phone.trim())) {
      errors.phone = "Enter a valid phone number";
    }
    if (!checkoutForm.address.trim())
      errors.address = "Delivery address is required";
    if (
      checkoutForm.payment === "Card / Mobile Pay" &&
      !checkoutForm.paymentAccount.trim()
    ) {
      errors.paymentAccount =
        checkoutForm.paymentProvider === "Visa / MasterCard"
          ? "Card number is required"
          : `${checkoutForm.paymentProvider} number is required`;
    }
    setCheckoutErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      setOrderSuccess(true);
      setOrderNumber(Math.floor(100000 + Math.random() * 900000));
      setOrderNumberCopied(false);
      onClearCart?.();
    }, 1800);
  };

  const handleCopyOrderNumber = async () => {
    if (!orderNumber || !navigator?.clipboard) return;

    await navigator.clipboard.writeText(String(orderNumber));
    setOrderNumberCopied(true);

    if (orderNumberCopyTimerRef.current) {
      clearTimeout(orderNumberCopyTimerRef.current);
    }

    orderNumberCopyTimerRef.current = setTimeout(() => {
      setOrderNumberCopied(false);
    }, 1800);
  };

  const handleClearCartClick = () => {
    if (isClearingCart || addToCartItems.length === 0) return;

    setIsClearingCart(true);

    clearCartTimerRef.current = setTimeout(() => {
      onClearCart?.();
      setIsClearingCart(false);
    }, 350);
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-[#1c2b43] bg-[rgba(9,14,28,0.92)] backdrop-blur-md"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          <button
            className="shrink-0 inline-flex items-center gap-2 cursor-pointer"
            onClick={() => handleMenuLinkClick("Home")}
          >
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] text-[#061510] shadow-[0_4px_14px_rgba(99,230,190,0.38)]">
              <FaBolt size={14} />
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-black bg-[linear-gradient(130deg,#f5f7ff_40%,#63e6be_100%)] bg-clip-text text-transparent">
              E-Vendoza
            </span>
          </button>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link}>
                <button
                  onClick={() => handleMenuLinkClick(link)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    link === "Menu" && categoriesOpen
                      ? "text-[#63e6be] bg-[rgba(99,230,190,0.08)]"
                      : i === 0
                        ? "text-[#63e6be] bg-[rgba(99,230,190,0.08)]"
                        : "text-[#8897b5] hover:text-[#f5f7ff] hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  {link}
                </button>
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
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
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
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
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
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
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
                    <div className="mt-4 relative overflow-hidden rounded-xl border border-dashed border-[#2b3d5e] bg-[rgba(10,16,30,0.45)] px-4 py-6 text-center">
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.12)_0%,transparent_70%)] blur-2xl" />
                      </div>
                      <p className="relative text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#ff9a76]">
                        Empty Favorites
                      </p>
                      <p className="relative mt-2 text-sm font-semibold text-[#c8d3eb]">
                        No favorites yet
                      </p>
                      <p className="relative mt-1 text-xs text-[#8897b5]">
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
                setCategoriesOpen(false);
                setMobileMenuOpen(false);
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
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
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
                    <div className="mt-4 relative overflow-hidden rounded-xl border border-dashed border-[#2b3d5e] bg-[rgba(10,16,30,0.45)] px-4 py-6 text-center">
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-2xl" />
                      </div>
                      <p className="relative text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#63e6be]">
                        Cart Status
                      </p>
                      <p className="relative mt-2 text-sm font-semibold text-[#c8d3eb]">
                        Your cart is empty
                      </p>
                      <p className="relative mt-1 text-xs text-[#8897b5]">
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
                                <div className="mt-0.5 flex items-center gap-2 text-xs">
                                  <span className="font-semibold text-[#63e6be]">
                                    ৳{item.price} each
                                  </span>
                                  {(item.basePrice ?? item.price) >
                                    item.price && (
                                    <>
                                      <span className="font-medium text-[#7d8aa8] line-through">
                                        ৳{item.basePrice}
                                      </span>
                                      <span className="rounded-full border border-[rgba(99,230,190,0.22)] bg-[rgba(99,230,190,0.08)] px-1.5 py-0.5 text-[0.58rem] font-bold text-[#63e6be]">
                                        {item.offerLabel || "Offer"}
                                      </span>
                                    </>
                                  )}
                                </div>
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
                        {savings > 0 && (
                          <div className="flex items-center justify-between text-[#63e6be]">
                            <span>Offer Savings</span>
                            <span className="font-semibold">-৳{savings}</span>
                          </div>
                        )}
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
                        <button
                          onClick={handleClearCartClick}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold transition-all duration-300 ${
                            isClearingCart
                              ? "border border-[rgba(255,154,118,0.35)] bg-[rgba(255,154,118,0.16)] text-[#ffb59d]"
                              : "border border-[rgba(255,154,118,0.28)] bg-[linear-gradient(135deg,rgba(255,154,118,0.14),rgba(255,99,71,0.08))] text-[#ff9a76] hover:-translate-y-0.5 hover:border-[#ff9a76] hover:shadow-[0_10px_20px_rgba(255,154,118,0.14)]"
                          }`}
                        >
                          {isClearingCart ? (
                            <>
                              <FaSpinner className="animate-spin" size={13} />
                              Clearing...
                            </>
                          ) : (
                            <>
                              <FaTrash size={13} />
                              Clear Cart
                            </>
                          )}
                        </button>
                        <button
                          onClick={openCheckout}
                          className="rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] py-2 text-sm font-bold text-[#071510] shadow-[0_10px_20px_rgba(99,230,190,0.28)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
                        >
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
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
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
                setMobileMenuOpen((prev) => !prev);
                setCategoriesOpen(false);
                setCartOpen(false);
                setFavoriteOpen(false);
                setUserOpen(false);
                setMobileSearchOpen(false);
              }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaXmark size={18} /> : <FaBars size={16} />}
            </button>
          </div>
        </div>
      </div>

      {categoriesOpen && allCategories.length > 0 && (
        <div className="hidden border-t border-[#1c2b43] bg-[rgba(9,14,28,0.98)] shadow-[0_18px_34px_rgba(2,8,20,0.45)] lg:block">
          <div className="container mx-auto px-4 py-5 md:px-6 lg:px-8">
            <div className="rounded-[1.75rem] border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-5 shadow-[0_18px_40px_rgba(2,8,20,0.38)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
                    Browse Categories
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#f5f7ff]">
                    Browse every category from the menu
                  </h3>
                </div>
                {selectedCategory && (
                  <span className="inline-flex items-center rounded-full border border-[rgba(99,230,190,0.24)] bg-[rgba(99,230,190,0.08)] px-3 py-1.5 text-sm font-bold text-[#63e6be]">
                    {selectedCategory}
                  </span>
                )}
              </div>

              <div className="mt-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max gap-3 pr-2">
                  {allCategories.map((category) => {
                    const isActive = selectedCategory === category.strCategory;

                    return (
                      <button
                        key={category.idCategory}
                        onClick={() =>
                          handleCategorySelect(category.strCategory)
                        }
                        className={`group flex w-54 shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                          isActive
                            ? "border-[#63e6be] bg-[rgba(99,230,190,0.1)] shadow-[0_12px_24px_rgba(99,230,190,0.12)]"
                            : "border-[#233453] bg-[rgba(10,16,30,0.72)] hover:-translate-y-0.5 hover:border-[#3d5480]"
                        }`}
                      >
                        <img
                          src={category.strCategoryThumb}
                          alt={category.strCategory}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#eef2ff]">
                            {category.strCategory}
                          </p>
                          <p className="text-xs text-[#8897b5]">
                            Tap to view foods
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1c2b43] bg-[rgba(9,14,28,0.98)] shadow-[0_18px_34px_rgba(2,8,20,0.45)]">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, i) => (
                <li key={link}>
                  <button
                    onClick={() => handleMenuLinkClick(link)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      link === "Menu" && categoriesOpen
                        ? "text-[#63e6be] bg-[rgba(99,230,190,0.08)]"
                        : i === 0
                          ? "text-[#63e6be] bg-[rgba(99,230,190,0.08)]"
                          : "text-[#8897b5] hover:text-[#f5f7ff] hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>

            {categories?.length > 0 && (
              <div className="mt-4 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 shadow-[0_16px_36px_rgba(2,8,20,0.35)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
                      Menu Categories
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#c8d3eb]">
                      Tap a category to jump into the menu
                    </p>
                  </div>
                  {selectedCategory && (
                    <span className="rounded-full border border-[rgba(99,230,190,0.24)] bg-[rgba(99,230,190,0.08)] px-2.5 py-1 text-[0.7rem] font-bold text-[#63e6be]">
                      {selectedCategory}
                    </span>
                  )}
                </div>

                <div className="mt-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex min-w-max gap-2 pr-2">
                    {categories.map((category) => {
                      const isActive =
                        selectedCategory === category.strCategory;

                      return (
                        <button
                          key={category.idCategory}
                          onClick={() =>
                            handleCategorySelect(category.strCategory)
                          }
                          className={`flex w-46 shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all ${
                            isActive
                              ? "border-[#63e6be] bg-[rgba(99,230,190,0.1)]"
                              : "border-[#233453] bg-[rgba(10,16,30,0.7)] hover:border-[#3d5480]"
                          }`}
                        >
                          <img
                            src={category.strCategoryThumb}
                            alt={category.strCategory}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="truncate text-sm font-semibold text-[#eef2ff]">
                            {category.strCategory}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {checkoutOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 overflow-y-auto bg-[rgba(2,8,20,0.87)] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            {!isPlacingOrder && !orderSuccess && (
              <div className="absolute inset-0 z-0" onClick={closeCheckout} />
            )}

            <div className="relative z-10 flex min-h-full items-center justify-center p-2 sm:p-6">
              <div className="relative mx-auto flex min-h-0 w-full max-w-176 flex-col overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.99),rgba(9,14,27,0.99))] shadow-[0_30px_70px_rgba(2,8,20,0.65)] max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-3rem)] sm:rounded-3xl">
                <div className="pointer-events-none absolute -right-18 -top-18 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.2)_0%,transparent_70%)] blur-2xl" />
                <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.18)_0%,transparent_70%)] blur-2xl" />

                {orderSuccess ? (
                  <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:py-20">
                    <div className="relative mb-7 flex h-20 w-20 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-[rgba(99,230,190,0.28)] animate-ping" />
                      <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] shadow-[0_0_40px_rgba(99,230,190,0.5)]">
                        <FaCircleCheck size={32} className="text-[#061510]" />
                      </span>
                    </div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#63e6be]">
                      Order Confirmed!
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[#f5f7ff] sm:text-3xl">
                      Your order is placed
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8897b5]">
                      We're preparing your food. Estimated delivery in{" "}
                      <span className="font-semibold text-[#c8d3eb]">
                        30–45 minutes
                      </span>
                      .
                    </p>
                    {orderNumber && (
                      <div className="mt-6 rounded-2xl border border-[rgba(99,230,190,0.2)] bg-[rgba(99,230,190,0.06)] px-6 py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8897b5]">
                              Order Number
                            </p>
                            <p className="mt-1 text-2xl font-black tracking-widest text-[#63e6be]">
                              #{orderNumber}
                            </p>
                          </div>
                          <button
                            onClick={handleCopyOrderNumber}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold transition-all duration-200 ${
                              orderNumberCopied
                                ? "border-[rgba(99,230,190,0.35)] bg-[rgba(99,230,190,0.12)] text-[#63e6be]"
                                : "border-[#2b3d5e] bg-[rgba(16,24,42,0.72)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be]"
                            }`}
                          >
                            {orderNumberCopied ? (
                              <FaCheck size={12} />
                            ) : (
                              <FaCopy size={12} />
                            )}
                            {orderNumberCopied ? "Copied" : "Copy Number"}
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={closeCheckout}
                      className="mt-8 rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] px-10 py-3 text-sm font-black text-[#071510] shadow-[0_14px_30px_rgba(99,230,190,0.3)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={closeCheckout}
                      className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-[#2b3d5e] bg-[rgba(10,16,30,0.7)] text-[#c8d3eb] transition-colors hover:border-[#ff8f6a] hover:text-[#ff8f6a]"
                      aria-label="Close checkout"
                    >
                      <FaXmark size={16} />
                    </button>

                    <div className="sticky top-0 z-10 shrink-0 border-b border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.99),rgba(9,14,27,0.99))] px-5 py-4 pr-16 sm:px-6 sm:pr-16">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff8f6a]">
                        Checkout
                      </p>
                      <h3 className="mt-1 text-xl font-black text-[#f5f7ff]">
                        Complete Your Order
                      </h3>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto space-y-5 px-4 py-5 pb-6 sm:px-6">
                      {/* ── Order summary ── */}
                      <div className="rounded-2xl border border-[#233453] bg-[rgba(10,16,30,0.7)] p-4">
                        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#8897b5]">
                          Order Summary
                        </p>
                        <div className="space-y-1.5">
                          {addToCartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="mr-3 truncate text-[#9ba5be]">
                                {item.name}{" "}
                                <span className="text-[#5e6f94]">
                                  ×{item.quantity}
                                </span>
                              </span>
                              <div className="shrink-0 text-right">
                                <p className="font-bold text-[#c8d3eb]">
                                  ৳{item.price * item.quantity}
                                </p>
                                {(item.basePrice ?? item.price) >
                                  item.price && (
                                  <p className="text-[0.65rem] text-[#7d8aa8] line-through">
                                    ৳{item.basePrice * item.quantity}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 space-y-1 border-t border-[#1c2b43] pt-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[#9ba5be]">Subtotal</span>
                            <span className="font-bold text-[#eef2ff]">
                              ৳{subtotal}
                            </span>
                          </div>
                          {savings > 0 && (
                            <div className="flex items-center justify-between text-[#63e6be]">
                              <span>Offer Savings</span>
                              <span className="font-bold">-৳{savings}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[#9ba5be]">Delivery Fee</span>
                            <span className="font-bold text-[#eef2ff]">
                              ৳{deliveryFee}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between border-t border-[#1c2b43] pt-2">
                            <span className="font-bold text-[#eef2ff]">
                              Total Payable
                            </span>
                            <span className="text-lg font-black text-[#63e6be]">
                              ৳{totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ── Delivery Info ── */}
                      <div className="space-y-2.5">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8897b5]">
                          Delivery Info
                        </p>

                        <div>
                          <input
                            type="text"
                            value={checkoutForm.name}
                            onChange={(e) =>
                              setCheckoutForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            onFocus={() =>
                              setCheckoutErrors((prev) => ({
                                ...prev,
                                name: undefined,
                              }))
                            }
                            placeholder="Full name *"
                            className={`w-full rounded-xl border bg-[rgba(10,16,30,0.7)] px-3.5 py-2.5 text-sm text-[#eef2ff] placeholder:text-[#5e6f94] outline-none transition-colors ${checkoutErrors.name ? "border-[#ff6b6b]" : "border-[#233453] focus:border-[#63e6be]"}`}
                          />
                          {checkoutErrors.name && (
                            <p className="mt-1 text-xs font-medium text-[#ff8080]">
                              {checkoutErrors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            type="tel"
                            value={checkoutForm.phone}
                            onChange={(e) =>
                              setCheckoutForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            onFocus={() =>
                              setCheckoutErrors((prev) => ({
                                ...prev,
                                phone: undefined,
                              }))
                            }
                            placeholder="Phone number *"
                            className={`w-full rounded-xl border bg-[rgba(10,16,30,0.7)] px-3.5 py-2.5 text-sm text-[#eef2ff] placeholder:text-[#5e6f94] outline-none transition-colors ${checkoutErrors.phone ? "border-[#ff6b6b]" : "border-[#233453] focus:border-[#63e6be]"}`}
                          />
                          {checkoutErrors.phone && (
                            <p className="mt-1 text-xs font-medium text-[#ff8080]">
                              {checkoutErrors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <textarea
                            value={checkoutForm.address}
                            onChange={(e) =>
                              setCheckoutForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            onFocus={() =>
                              setCheckoutErrors((prev) => ({
                                ...prev,
                                address: undefined,
                              }))
                            }
                            placeholder="Delivery address *"
                            rows={2}
                            className={`w-full resize-none rounded-xl border bg-[rgba(10,16,30,0.7)] px-3.5 py-2.5 text-sm text-[#eef2ff] placeholder:text-[#5e6f94] outline-none transition-colors ${checkoutErrors.address ? "border-[#ff6b6b]" : "border-[#233453] focus:border-[#63e6be]"}`}
                          />
                          {checkoutErrors.address && (
                            <p className="mt-1 text-xs font-medium text-[#ff8080]">
                              {checkoutErrors.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ── Payment Method ── */}
                      <div className="space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8897b5]">
                          Payment Method
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              id: "Cash on Delivery",
                              emoji: "💵",
                              sub: "Pay on arrival",
                            },
                            {
                              id: "Card / Mobile Pay",
                              emoji: "💳",
                              sub: "Online payment",
                            },
                          ].map(({ id, emoji, sub }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() =>
                                setCheckoutForm((prev) => ({
                                  ...prev,
                                  payment: id,
                                }))
                              }
                              className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3.5 text-center transition-all duration-200 ${
                                checkoutForm.payment === id
                                  ? "border-[#63e6be] bg-[rgba(99,230,190,0.1)] shadow-[0_0_0_1px_rgba(99,230,190,0.25)]"
                                  : "border-[#233453] bg-[rgba(10,16,30,0.6)] hover:border-[#3d5480]"
                              }`}
                            >
                              <span className="text-2xl leading-none">
                                {emoji}
                              </span>
                              <span
                                className={`text-xs font-bold leading-tight ${checkoutForm.payment === id ? "text-[#63e6be]" : "text-[#c8d3eb]"}`}
                              >
                                {id}
                              </span>
                              <span className="text-[0.65rem] text-[#8897b5]">
                                {sub}
                              </span>
                            </button>
                          ))}
                        </div>

                        {checkoutForm.payment === "Card / Mobile Pay" && (
                          <div className="space-y-3 rounded-2xl border border-[#1c2b43] bg-[rgba(8,12,24,0.75)] p-4">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8897b5]">
                              Select Provider
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                {
                                  id: "Visa / MasterCard",
                                  label: "Visa / MC",
                                  sub: "Credit · Debit",
                                  color: "#4f93ff",
                                  bg: "rgba(79,147,255,0.12)",
                                  border: "rgba(79,147,255,0.4)",
                                  icon: "💳",
                                },
                                {
                                  id: "bKash",
                                  label: "bKash",
                                  sub: "Mobile Banking",
                                  color: "#f04387",
                                  bg: "rgba(240,67,135,0.12)",
                                  border: "rgba(240,67,135,0.4)",
                                  icon: "b",
                                },
                                {
                                  id: "Nagad",
                                  label: "Nagad",
                                  sub: "Mobile Banking",
                                  color: "#ff7a3d",
                                  bg: "rgba(255,122,61,0.12)",
                                  border: "rgba(255,122,61,0.4)",
                                  icon: "N",
                                },
                                {
                                  id: "Rocket",
                                  label: "Rocket",
                                  sub: "Mobile Banking",
                                  color: "#a96fdb",
                                  bg: "rgba(169,111,219,0.12)",
                                  border: "rgba(169,111,219,0.4)",
                                  icon: "R",
                                },
                              ].map(
                                ({
                                  id,
                                  label,
                                  sub,
                                  color,
                                  bg,
                                  border,
                                  icon,
                                }) => {
                                  const active =
                                    checkoutForm.paymentProvider === id;
                                  return (
                                    <button
                                      key={id}
                                      type="button"
                                      onClick={() =>
                                        setCheckoutForm((prev) => ({
                                          ...prev,
                                          paymentProvider: id,
                                          paymentAccount: "",
                                        }))
                                      }
                                      style={
                                        active
                                          ? {
                                              borderColor: border,
                                              backgroundColor: bg,
                                              boxShadow: `0 0 0 1px ${border}`,
                                            }
                                          : {}
                                      }
                                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                                        active
                                          ? "border-transparent"
                                          : "border-[#233453] bg-[rgba(10,16,30,0.6)] hover:border-[#3d5480]"
                                      }`}
                                    >
                                      <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black"
                                        style={{
                                          color,
                                          backgroundColor: active
                                            ? bg
                                            : "rgba(16,24,42,0.8)",
                                          border: `1.5px solid ${border}`,
                                        }}
                                      >
                                        {icon}
                                      </span>
                                      <div className="min-w-0">
                                        <p
                                          className="truncate text-xs font-bold"
                                          style={{
                                            color: active ? color : "#c8d3eb",
                                          }}
                                        >
                                          {label}
                                        </p>
                                        <p className="text-[0.62rem] text-[#8897b5]">
                                          {sub}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                },
                              )}
                            </div>

                            <div>
                              <input
                                type="text"
                                value={checkoutForm.paymentAccount}
                                onChange={(e) =>
                                  setCheckoutForm((prev) => ({
                                    ...prev,
                                    paymentAccount: e.target.value,
                                  }))
                                }
                                onFocus={() =>
                                  setCheckoutErrors((prev) => ({
                                    ...prev,
                                    paymentAccount: undefined,
                                  }))
                                }
                                placeholder={
                                  checkoutForm.paymentProvider ===
                                  "Visa / MasterCard"
                                    ? "Card number *"
                                    : `${checkoutForm.paymentProvider} number *`
                                }
                                className={`w-full rounded-xl border bg-[rgba(10,16,30,0.7)] px-3.5 py-2.5 text-sm text-[#eef2ff] placeholder:text-[#5e6f94] outline-none transition-colors ${checkoutErrors.paymentAccount ? "border-[#ff6b6b]" : "border-[#233453] focus:border-[#63e6be]"}`}
                              />
                              {checkoutErrors.paymentAccount && (
                                <p className="mt-1 text-xs font-medium text-[#ff8080]">
                                  {checkoutErrors.paymentAccount}
                                </p>
                              )}
                            </div>

                            <input
                              type="text"
                              value={checkoutForm.paymentNote}
                              onChange={(e) =>
                                setCheckoutForm((prev) => ({
                                  ...prev,
                                  paymentNote: e.target.value,
                                }))
                              }
                              placeholder="Transaction note (optional)"
                              className="w-full rounded-xl border border-[#233453] bg-[rgba(10,16,30,0.7)] px-3.5 py-2.5 text-sm text-[#eef2ff] placeholder:text-[#5e6f94] outline-none transition-colors focus:border-[#63e6be]"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckoutSubmit}
                        disabled={isPlacingOrder}
                        className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-black text-[#071510] shadow-[0_14px_30px_rgba(99,230,190,0.3)] transition duration-200 bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] ${isPlacingOrder ? "cursor-not-allowed opacity-75" : "hover:-translate-y-0.5 hover:brightness-110"}`}
                      >
                        {isPlacingOrder ? (
                          <>
                            <FaSpinner size={14} className="animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          <>
                            <FaCartShopping size={14} />
                            Confirm & Place Order
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
};

export default NavBar;
