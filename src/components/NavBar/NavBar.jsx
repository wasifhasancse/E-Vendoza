import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaArrowRightToBracket,
  FaBars,
  FaBell,
  FaBolt,
  FaBowlFood,
  FaCartShopping,
  FaCheck,
  FaChevronRight,
  FaCircleCheck,
  FaCircleExclamation,
  FaClockRotateLeft,
  FaCopy,
  FaCreditCard,
  FaDatabase,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFire,
  FaGear,
  FaHeart,
  FaKey,
  FaLocationDot,
  FaLock,
  FaMagnifyingGlass,
  FaMinus,
  FaPencil,
  FaPhone,
  FaPlus,
  FaRightFromBracket,
  FaShield,
  FaSpinner,
  FaStar,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
  FaTrashCan,
  FaUser,
  FaUserMinus,
  FaUserPlus,
  FaUtensils,
  FaXmark,
} from "react-icons/fa6";
import AuthModal from "../Auth/AuthModal";
import ViewDetailsModal from "../Offers/ViewDetailsModal";
import { useToast } from "../Toast/useToast";

const NAV_LINKS = ["Home", "Menu", "Food", "About"];
const AUTH_SESSION_STORAGE_KEY = "e-vendoza-auth-session";

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
  onClearFavorites,
}) => {
  const toast = useToast();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [myProfileOpen, setMyProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securityErrors, setSecurityErrors] = useState({});
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [showSecPw, setShowSecPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const raw = window.localStorage.getItem("e-vendoza-settings");
      return raw
        ? JSON.parse(raw)
        : {
            orderNotify: true,
            promoNotify: true,
            soundFx: false,
            compactCart: false,
          };
    } catch {
      return {
        orderNotify: true,
        promoNotify: true,
        soundFx: false,
        compactCart: false,
      };
    }
  });
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const raw = window.localStorage.getItem("e-vendoza-order-history");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
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
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const orderNumberCopyTimerRef = useRef(null);
  const clearCartTimerRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const searchRequestIdRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchDetailsMeal, setSearchDetailsMeal] = useState(null);
  const [searchDropdownStyle, setSearchDropdownStyle] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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
    setSearchDropdownOpen(false);
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

  const openAuthModal = (mode) => {
    closeAllPanels();
    setAuthModalMode(mode);
  };

  const PROFILE_EXTRA_KEY = (email) => `e-vendoza-profile-${email}`;

  const loadExtendedProfile = (email) => {
    try {
      const raw = window.localStorage.getItem(PROFILE_EXTRA_KEY(email));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const openMyProfile = () => {
    setUserOpen(false);
    const extra = currentUser ? loadExtendedProfile(currentUser.email) : {};
    setProfileForm({
      fullName: currentUser?.fullName ?? "",
      phone: extra.phone ?? "",
      location: extra.location ?? "",
      bio: extra.bio ?? "",
    });
    setProfileErrors({});
    setIsEditingProfile(false);
    setMyProfileOpen(true);
  };

  const handleSaveProfile = () => {
    const errors = {};
    if (!profileForm.fullName.trim()) errors.fullName = "Full name is required";
    if (
      profileForm.phone &&
      !/^[0-9+\s()\-]{7,20}$/.test(profileForm.phone.trim())
    )
      errors.phone = "Enter a valid phone number";
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSavingProfile(true);
    setTimeout(() => {
      const updatedUser = {
        ...currentUser,
        fullName: profileForm.fullName.trim(),
      };
      // Update session storage
      const sessionPayload = JSON.stringify(updatedUser);
      if (window.localStorage.getItem("e-vendoza-auth-session")) {
        window.localStorage.setItem("e-vendoza-auth-session", sessionPayload);
      } else {
        window.sessionStorage.setItem("e-vendoza-auth-session", sessionPayload);
      }
      // Update stored users list
      try {
        const raw = window.localStorage.getItem("e-vendoza-auth-users");
        const users = raw ? JSON.parse(raw) : [];
        const idx = users.findIndex((u) => u.email === currentUser.email);
        if (idx !== -1) {
          users[idx] = { ...users[idx], fullName: profileForm.fullName.trim() };
          window.localStorage.setItem(
            "e-vendoza-auth-users",
            JSON.stringify(users),
          );
        }
      } catch (_) {
        /* ignore */
      }
      // Save extended profile fields
      window.localStorage.setItem(
        PROFILE_EXTRA_KEY(currentUser.email),
        JSON.stringify({
          phone: profileForm.phone.trim(),
          location: profileForm.location.trim(),
          bio: profileForm.bio.trim(),
        }),
      );
      setCurrentUser(updatedUser);
      setIsEditingProfile(false);
      setIsSavingProfile(false);
      toast.success("Profile updated successfully! ✨");
    }, 700);
  };

  const saveSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    window.localStorage.setItem("e-vendoza-settings", JSON.stringify(updated));
  };

  const openSecurity = () => {
    setUserOpen(false);
    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSecurityErrors({});
    setSecuritySuccess("");
    setShowDeleteConfirm(false);
    setSecurityOpen(true);
  };

  const openSettings = () => {
    setUserOpen(false);
    setSettingsOpen(true);
  };

  const handleChangePassword = () => {
    const errors = {};
    const isDefaultUser = currentUser?.email === "user@gmail.com";
    if (!securityForm.currentPassword)
      errors.currentPassword = "Current password is required";
    if (securityForm.newPassword.length < 6)
      errors.newPassword = "New password must be at least 6 characters";
    if (securityForm.confirmPassword !== securityForm.newPassword)
      errors.confirmPassword = "Passwords do not match";
    setSecurityErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSavingSecurity(true);
    setTimeout(() => {
      setIsSavingSecurity(false);
      if (isDefaultUser) {
        setSecurityErrors({
          currentPassword: "Demo account password cannot be changed",
        });
        return;
      }
      try {
        const raw = window.localStorage.getItem("e-vendoza-auth-users");
        const users = raw ? JSON.parse(raw) : [];
        const idx = users.findIndex((u) => u.email === currentUser.email);
        if (
          idx === -1 ||
          users[idx].password !== securityForm.currentPassword
        ) {
          setSecurityErrors({ currentPassword: "Incorrect current password" });
          return;
        }
        users[idx].password = securityForm.newPassword;
        window.localStorage.setItem(
          "e-vendoza-auth-users",
          JSON.stringify(users),
        );
        setSecuritySuccess("Password changed successfully!");
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password changed successfully! 🔒");
      } catch (_) {
        setSecurityErrors({
          currentPassword: "Something went wrong. Try again.",
        });
      }
    }, 800);
  };

  const handleDeleteAccount = () => {
    if (currentUser?.email === "user@gmail.com") {
      toast.error("Demo account cannot be deleted.");
      setShowDeleteConfirm(false);
      return;
    }
    try {
      const raw = window.localStorage.getItem("e-vendoza-auth-users");
      const users = raw ? JSON.parse(raw) : [];
      const updated = users.filter((u) => u.email !== currentUser.email);
      window.localStorage.setItem(
        "e-vendoza-auth-users",
        JSON.stringify(updated),
      );
    } catch (_) {
      /* ignore */
    }
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_EXTRA_KEY(currentUser.email));
    setCurrentUser(null);
    setSecurityOpen(false);
    setShowDeleteConfirm(false);
    toast.info("Account deleted. Goodbye! 👋");
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalMode(null);
    setUserOpen(false);
    setMobileMenuOpen(false);
    toast.success(`Welcome back, ${user.fullName}! 👋`);
    scrollToSection("hero-section");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    setCurrentUser(null);
    setUserOpen(false);
    setMobileMenuOpen(false);
    toast.info(`Logged out successfully! See you soon 👋`);
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

  // fromMobile=true: close everything and scroll to the section.
  // fromMobile=false + link === "Menu": toggle the desktop categories dropdown.
  const handleMenuLinkClick = (link, fromMobile = false) => {
    if (!fromMobile && link === "Menu") {
      // Desktop "Menu" toggles the categories dropdown
      setCategoriesOpen((prev) => !prev);
      setCartOpen(false);
      setFavoriteOpen(false);
      setUserOpen(false);
      setMobileSearchOpen(false);
      setSearchDropdownOpen(false);
      return;
    }

    // All other cases (mobile or non-Menu links): close everything then scroll
    setCategoriesOpen(false);
    setCartOpen(false);
    setFavoriteOpen(false);
    setUserOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setSearchDropdownOpen(false);

    if (link === "Home") scrollToSection("hero-section");
    if (link === "Menu") scrollToSection("menu-section");
    if (link === "Food") scrollToSection("menu-items-section");
    if (link === "About") scrollToSection("about-section");
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
      if (searchDropdownRef.current?.contains(event.target)) return;
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

    const handleOpenAuthModal = () => {
      closeAllPanels();
      setAuthModalMode("login");
    };

    window.addEventListener("open-cart-panel", handleOpenCartPanel);
    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    return () => {
      window.removeEventListener("open-cart-panel", handleOpenCartPanel);
      window.removeEventListener("open-auth-modal", handleOpenAuthModal);
    };
  }, []);

  useEffect(() => {
    try {
      const session =
        window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) ||
        window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
      const parsed = session ? JSON.parse(session) : null;

      if (parsed?.email) {
        setCurrentUser(parsed);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (orderNumberCopyTimerRef.current) {
        clearTimeout(orderNumberCopyTimerRef.current);
      }
      if (clearCartTimerRef.current) {
        clearTimeout(clearCartTimerRef.current);
      }
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
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
      const newOrderNum = Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        id: newOrderNum,
        date: new Date().toISOString(),
        items: addToCartItems.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        total:
          addToCartItems.reduce((s, i) => s + i.price * i.quantity, 0) + 60,
        address: checkoutForm.address,
        payment: checkoutForm.payment,
        status: "Confirmed",
      };
      setOrderHistory((prev) => {
        const updated = [newOrder, ...prev];
        window.localStorage.setItem(
          "e-vendoza-order-history",
          JSON.stringify(updated),
        );
        return updated;
      });
      setIsPlacingOrder(false);
      setOrderSuccess(true);
      setOrderNumber(newOrderNum);
      setOrderNumberCopied(false);
      onClearCart?.();
      toast.success(`Order placed successfully! 🎉`);
    }, 1800);
  };

  const handleCopyOrderNumber = async () => {
    if (!orderNumber || !navigator?.clipboard) return;

    await navigator.clipboard.writeText(String(orderNumber));
    setOrderNumberCopied(true);
    toast.success(`Order #${orderNumber} copied! 📋`);

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
      toast.info(`Cart cleared! All items removed 🧹`);
      setIsClearingCart(false);
    }, 350);
  };

  // ── Search helpers ──────────────────────────────────────────────────────────
  const getSearchItemPrice = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return (hash % 1901) + 100;
  };

  const getSearchItemRating = (id) => {
    let hash = 0;
    const key = id + "rating";
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return (3.5 + (hash % 16) / 10).toFixed(1);
  };

  const clearSearch = () => {
    searchRequestIdRef.current += 1;
    setSearchQuery("");
    setSearchResults([]);
    setSearchDropdownOpen(false);
    setSearchLoading(false);
    setSearchDropdownStyle(null);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
  };

  const updateSearchDropdownPosition = () => {
    if (typeof window === "undefined") return;

    const anchor = mobileSearchOpen
      ? mobileSearchRef.current
      : desktopSearchRef.current;

    if (!anchor) {
      setSearchDropdownStyle(null);
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gutter = mobileSearchOpen ? 16 : 12;
    const desiredWidth = mobileSearchOpen
      ? Math.min(rect.width, viewportWidth - gutter * 2)
      : Math.min(544, viewportWidth - gutter * 2);
    const centeredLeft = mobileSearchOpen
      ? rect.left
      : rect.left + rect.width / 2 - desiredWidth / 2;
    const left = Math.max(
      gutter,
      Math.min(centeredLeft, viewportWidth - desiredWidth - gutter),
    );
    const top = rect.bottom + 8;
    const maxHeight = Math.max(220, viewportHeight - top - gutter);

    setSearchDropdownStyle({
      left,
      top,
      width: desiredWidth,
      maxHeight,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (query.trim().length < 2) {
      searchRequestIdRef.current += 1;
      setSearchResults([]);
      setSearchDropdownOpen(false);
      setSearchLoading(false);
      setSearchDropdownStyle(null);
      return;
    }

    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;
    setSearchLoading(true);
    setSearchDropdownOpen(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`,
        );
        const json = await res.json();
        if (searchRequestIdRef.current !== requestId) return;
        setSearchResults(json?.meals ?? []);
      } catch {
        if (searchRequestIdRef.current !== requestId) return;
        setSearchResults([]);
      } finally {
        if (searchRequestIdRef.current === requestId) {
          setSearchLoading(false);
        }
      }
    }, 420);
  };

  useEffect(() => {
    if (!searchDropdownOpen || searchQuery.trim().length < 2) {
      setSearchDropdownStyle(null);
      return undefined;
    }

    updateSearchDropdownPosition();

    const handleViewportChange = () => {
      updateSearchDropdownPosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [searchDropdownOpen, searchQuery, mobileSearchOpen]);

  const renderSearchDropdown = () => {
    if (
      !searchDropdownOpen ||
      searchQuery.trim().length < 2 ||
      !searchDropdownStyle ||
      typeof document === "undefined"
    ) {
      return null;
    }

    return createPortal(
      <div
        ref={searchDropdownRef}
        className="fixed z-90 overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.99),rgba(9,14,27,0.99))] shadow-[0_20px_44px_rgba(2,8,20,0.7)]"
        style={{
          left: searchDropdownStyle.left,
          top: searchDropdownStyle.top,
          width: searchDropdownStyle.width,
        }}
      >
        {searchLoading ? (
          <div className="flex items-center gap-3 px-4 py-5">
            <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#2b3d5e] border-t-[#63e6be]" />
            <p className="text-sm font-medium text-[#8897b5]">
              Searching for{" "}
              <span className="font-bold text-[#eef2ff]">
                &#34;{searchQuery}&#34;
              </span>
              ...
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="px-4 py-7 text-center">
            <div className="pointer-events-none mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#1c2b43] bg-[rgba(255,143,106,0.08)] text-[#ff8f6a]">
              <FaMagnifyingGlass size={18} />
            </div>
            <p className="text-sm font-semibold text-[#c8d3eb]">
              No results for{" "}
              <span className="font-bold text-[#eef2ff]">
                &#34;{searchQuery}&#34;
              </span>
            </p>
            <p className="mt-1 text-xs text-[#5e6f94]">
              Try something like &#34;Chicken&#34; or &#34;Pasta&#34;
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 border-b border-[#111927] px-4 py-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#5e6f94]">
                <FaBowlFood size={11} className="text-[#63e6be]" />
                {searchResults.length} meal
                {searchResults.length !== 1 ? "s" : ""} found
              </div>
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-1 text-[0.68rem] font-bold text-[#5e6f94] transition-colors hover:text-[#c8d3eb]"
              >
                <FaXmark size={10} />
                Clear
              </button>
            </div>
            <div
              className="divide-y divide-[#0d1524] overflow-y-auto [scrollbar-color:#1c2b43_transparent] [scrollbar-width:thin]"
              style={{ maxHeight: searchDropdownStyle.maxHeight }}
            >
              {searchResults.slice(0, 8).map((meal) => {
                const price = getSearchItemPrice(meal.idMeal);
                const rating = getSearchItemRating(meal.idMeal);
                return (
                  <div
                    key={meal.idMeal}
                    onClick={() => {
                      setSearchDetailsMeal(meal);
                      setSearchDropdownOpen(false);
                      setMobileSearchOpen(false);
                    }}
                    className="group relative cursor-pointer px-4 py-3.5 transition-colors duration-200 hover:bg-[rgba(99,230,190,0.06)]"
                  >
                    {/* Hover left accent bar */}
                    <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-[#63e6be] transition-all duration-200 group-hover:h-3/4" />

                    <div className="relative flex items-center gap-3 pr-13 sm:pr-15">
                      <div className="relative shrink-0">
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          className="h-14 w-14 rounded-xl border border-[#1c2b43] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#2f354a] bg-[#1a2035]">
                          <FaFire size={8} className="text-[#ff9a76]" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate pr-1 text-sm font-bold text-[#eef2ff] transition-colors duration-200 group-hover:text-[#63e6be] sm:text-[0.95rem]">
                            {meal.strMeal}
                          </p>
                          <span className="shrink-0 text-xs font-black text-[#63e6be] sm:text-[0.8rem]">
                            ৳{price}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FaStar
                              key={s}
                              size={9}
                              className={
                                s <= Math.round(rating)
                                  ? "text-[#ffd166]"
                                  : "text-[#2e3d57]"
                              }
                            />
                          ))}
                          <span className="ml-1 text-[0.68rem] font-semibold text-[#7d8aa8]">
                            {rating}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {meal.strCategory && (
                            <span className="max-w-full truncate rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.76)] px-2 py-0.5 text-[0.62rem] font-semibold text-[#93a3c2]">
                              {meal.strCategory}
                            </span>
                          )}
                          {meal.strArea && (
                            <span className="hidden rounded-full border border-[#1a2740] bg-[rgba(99,230,190,0.06)] px-2 py-0.5 text-[0.62rem] font-semibold text-[#63e6be]/80 sm:inline-flex">
                              {meal.strArea}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(
                            {
                              idMeal: meal.idMeal,
                              strMeal: meal.strMeal,
                              strMealThumb: meal.strMealThumb,
                            },
                            price,
                          );
                          toast.success(`${meal.strMeal} added to cart! 🛒`);
                          clearSearch();
                          setMobileSearchOpen(false);
                        }}
                        className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#63e6be]/35 bg-[linear-gradient(135deg,rgba(99,230,190,0.15),rgba(77,217,172,0.08))] text-[#63e6be] shadow-[0_4px_12px_rgba(99,230,190,0.14)] transition-all duration-200 hover:scale-105 hover:border-[#63e6be]/65 hover:bg-[linear-gradient(135deg,rgba(99,230,190,0.24),rgba(77,217,172,0.14))] hover:shadow-[0_8px_18px_rgba(99,230,190,0.24)]"
                        aria-label="Add to cart"
                      >
                        <FaCartShopping size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>,
      document.body,
    );
  };
  // ── End search helpers ───────────────────────────────────────────────────────

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
            <div ref={desktopSearchRef} className="relative hidden sm:block">
              <FaMagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#5e6f94]"
                size={13}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2)
                    setSearchDropdownOpen(true);
                }}
                placeholder="Search food..."
                className="w-44 rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] py-2 pl-9 pr-8 text-sm text-[#c8d3eb] placeholder:text-[#5e6f94] outline-none transition-all hover:border-[#32507a] hover:shadow-[0_0_0_3px_rgba(99,230,190,0.08)] focus:border-[#63e6be] focus:shadow-[0_0_0_3px_rgba(99,230,190,0.14)] md:w-56 xl:w-60"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6f94] transition-colors hover:text-[#c8d3eb]"
                  aria-label="Clear search"
                >
                  <FaXmark size={11} />
                </button>
              )}
              {renderSearchDropdown()}
            </div>

            <div className="relative">
              {/* Desktop: text + icon button (lg+) */}
              <button
                className="relative hidden lg:inline-flex items-center gap-2 rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] px-3 py-2 text-sm font-semibold text-[#c8d3eb] transition-all hover:border-[#ff8f6a] hover:text-[#ff8f6a] hover:shadow-[0_0_0_3px_rgba(255,143,106,0.08)]"
                onClick={() => {
                  setFavoriteOpen((prev) => !prev);
                  setCartOpen(false);
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
                  setUserOpen(false);
                  setMobileSearchOpen(false);
                  setSearchDropdownOpen(false);
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

              {/* Mobile/tablet: icon-only button (below lg) */}
              <button
                className="relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#ff8f6a] hover:text-[#ff8f6a] transition-colors lg:hidden"
                onClick={() => {
                  setFavoriteOpen((prev) => !prev);
                  setCartOpen(false);
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
                  setUserOpen(false);
                  setMobileSearchOpen(false);
                  setSearchDropdownOpen(false);
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
                                onClick={() => {
                                  onRemoveFavorite(item.id);
                                  toast.info(
                                    `${item.name} removed from favorites 💔`,
                                  );
                                }}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-[#2b3d5e] text-[#ff9a76] transition-colors hover:border-[#ff9a76]"
                                aria-label="Remove favorite"
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                onAddToCart(
                                  {
                                    idMeal: item.id,
                                    strMeal: item.name,
                                    strMealThumb: item.image,
                                  },
                                  item.price,
                                );
                                toast.success(`${item.name} added to cart! 🛒`);
                              }}
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
                setSearchDropdownOpen(false);
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
                  setSearchDropdownOpen(false);
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
                                onClick={() => {
                                  onRemoveItem(item.id);
                                  toast.info(
                                    `${item.name} removed from cart 🗑️`,
                                  );
                                }}
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
                  if (!currentUser) {
                    openAuthModal("login");
                    return;
                  }
                  setUserOpen((prev) => !prev);
                  setCartOpen(false);
                  setFavoriteOpen(false);
                  setCategoriesOpen(false);
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(false);
                  setSearchDropdownOpen(false);
                }}
                aria-label="Toggle user menu"
              >
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt={currentUser ? currentUser.fullName : "User"}
                  className="h-full w-full object-cover"
                />
              </button>

              {userOpen && currentUser && (
                <div className="absolute right-0 z-70 mt-2 w-[min(20rem,calc(100vw-1rem))] rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(12,18,34,0.99),rgba(7,11,24,0.99))] shadow-[0_24px_48px_rgba(2,8,20,0.65)] overflow-hidden">
                  {/* Profile header */}
                  <div className="relative overflow-hidden px-4 py-4">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,230,190,0.12),transparent_65%)]" />
                    <div className="relative flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#63e6be]/50 shadow-[0_0_12px_rgba(99,230,190,0.3)]">
                          <img
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            alt={currentUser.fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#090e1c] bg-[#63e6be]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[#eef2ff]">
                          {currentUser.fullName}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-[0.72rem] text-[#8897b5]">
                          <FaEnvelope
                            size={10}
                            className="shrink-0 text-[#63e6be]"
                          />
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(99,230,190,0.28)] bg-[rgba(99,230,190,0.08)] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#63e6be] animate-pulse" />
                      <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-[#63e6be]">
                        Active Session
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#1a2840]" />

                  {/* Stats row */}
                  <div className="grid grid-cols-2 divide-x divide-[#1a2840] border-b border-[#1a2840]">
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        setCartOpen(true);
                      }}
                      className="flex flex-col items-center gap-0.5 py-3 transition-colors hover:bg-[rgba(99,230,190,0.05)]"
                    >
                      <span className="text-lg font-black text-[#63e6be]">
                        {totalItems}
                      </span>
                      <span className="flex items-center gap-1 text-[0.67rem] font-semibold text-[#7d8aa8]">
                        <FaCartShopping size={10} /> Cart Items
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        setFavoriteOpen(true);
                      }}
                      className="flex flex-col items-center gap-0.5 py-3 transition-colors hover:bg-[rgba(255,143,106,0.05)]"
                    >
                      <span className="text-lg font-black text-[#ff8f6a]">
                        {favoriteItems.length}
                      </span>
                      <span className="flex items-center gap-1 text-[0.67rem] font-semibold text-[#7d8aa8]">
                        <FaHeart size={10} /> Favourites
                      </span>
                    </button>
                  </div>

                  {/* Menu items */}
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={openMyProfile}
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[rgba(99,230,190,0.07)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#223252] bg-[rgba(99,230,190,0.08)] text-[#63e6be] transition-colors group-hover:border-[#63e6be]/40">
                        <FaUser size={13} />
                      </span>
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold text-[#dce6ff]">
                          My Profile
                        </span>
                        <span className="block text-[0.68rem] text-[#617393]">
                          View &amp; edit account
                        </span>
                      </span>
                      <FaChevronRight
                        size={11}
                        className="text-[#3e5070] transition-transform group-hover:translate-x-0.5"
                      />
                    </button>

                    <button
                      onClick={() => {
                        setUserOpen(false);
                        setOrderHistoryOpen(true);
                      }}
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[rgba(255,209,102,0.06)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#223252] bg-[rgba(255,209,102,0.08)] text-[#ffd166] transition-colors group-hover:border-[#ffd166]/40">
                        <FaClockRotateLeft size={13} />
                      </span>
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold text-[#dce6ff]">
                          Order History
                        </span>
                        <span className="block text-[0.68rem] text-[#617393]">
                          {orderHistory.length} past order
                          {orderHistory.length !== 1 ? "s" : ""}
                        </span>
                      </span>
                      <FaChevronRight
                        size={11}
                        className="text-[#3e5070] transition-transform group-hover:translate-x-0.5"
                      />
                    </button>

                    <button
                      onClick={openSecurity}
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[rgba(255,255,255,0.04)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#223252] bg-[rgba(255,255,255,0.04)] text-[#9ba5be] transition-colors group-hover:border-[#4a5a7a]/60">
                        <FaShield size={13} />
                      </span>
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold text-[#dce6ff]">
                          Security
                        </span>
                        <span className="block text-[0.68rem] text-[#617393]">
                          Password &amp; account safety
                        </span>
                      </span>
                      <FaChevronRight
                        size={11}
                        className="text-[#3e5070] transition-transform group-hover:translate-x-0.5"
                      />
                    </button>

                    <button
                      onClick={openSettings}
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[rgba(255,255,255,0.04)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#223252] bg-[rgba(255,255,255,0.04)] text-[#9ba5be] transition-colors group-hover:border-[#4a5a7a]/60">
                        <FaGear size={13} />
                      </span>
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold text-[#dce6ff]">
                          Settings
                        </span>
                        <span className="block text-[0.68rem] text-[#617393]">
                          Notifications &amp; preferences
                        </span>
                      </span>
                      <FaChevronRight
                        size={11}
                        className="text-[#3e5070] transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>

                  <div className="border-t border-[#1a2840] p-2">
                    <button
                      onClick={handleLogout}
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[rgba(255,90,90,0.08)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#3a1c1c] bg-[rgba(255,100,100,0.08)] text-[#ff6b6b] transition-colors group-hover:border-[#ff6b6b]/40">
                        <FaRightFromBracket size={13} />
                      </span>
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold text-[#ffaaaa]">
                          Log Out
                        </span>
                        <span className="block text-[0.68rem] text-[#7a4a4a]">
                          End your session
                        </span>
                      </span>
                    </button>
                  </div>
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
                setSearchDropdownOpen(false);
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
            <div ref={mobileSearchRef} className="relative">
              <FaMagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#5e6f94]"
                size={13}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2)
                    setSearchDropdownOpen(true);
                }}
                placeholder="Search food..."
                autoFocus
                className="w-full rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] pl-9 pr-8 py-2.5 text-sm text-[#c8d3eb] placeholder:text-[#5e6f94] outline-none transition-all hover:border-[#32507a] focus:border-[#63e6be] focus:shadow-[0_0_0_3px_rgba(99,230,190,0.14)]"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6f94] transition-colors hover:text-[#c8d3eb]"
                  aria-label="Clear search"
                >
                  <FaXmark size={11} />
                </button>
              )}
              {renderSearchDropdown()}
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
                    onClick={() => handleMenuLinkClick(link, true)}
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

            <div className="mt-4 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-4 shadow-[0_16px_36px_rgba(2,8,20,0.35)]">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
                {currentUser ? "Your Account" : "Account"}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#c8d3eb]">
                {currentUser
                  ? `${currentUser.fullName} is signed in`
                  : "Secure access for orders and saved details"}
              </p>

              {currentUser ? (
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => handleMenuLinkClick("Home", true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(99,230,190,0.24)] bg-[rgba(99,230,190,0.08)] px-3 py-2.5 text-sm font-bold text-[#63e6be] transition-all hover:border-[#63e6be] hover:bg-[rgba(99,230,190,0.14)]"
                  >
                    <FaUser size={13} />
                    Go Home
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,143,106,0.24)] bg-[rgba(255,143,106,0.08)] px-3 py-2.5 text-sm font-bold text-[#ffb08e] transition-all hover:border-[#ff8f6a] hover:bg-[rgba(255,143,106,0.14)]"
                  >
                    <FaRightFromBracket size={13} />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => openAuthModal("login")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(99,230,190,0.24)] bg-[rgba(99,230,190,0.08)] px-3 py-2.5 text-sm font-bold text-[#63e6be] transition-all hover:border-[#63e6be] hover:bg-[rgba(99,230,190,0.14)]"
                  >
                    <FaArrowRightToBracket size={13} />
                    Log In
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,143,106,0.24)] bg-[rgba(255,143,106,0.08)] px-3 py-2.5 text-sm font-bold text-[#ffb08e] transition-all hover:border-[#ff8f6a] hover:bg-[rgba(255,143,106,0.14)]"
                  >
                    <FaUserPlus size={13} />
                    Sign Up
                  </button>
                  <button
                    onClick={() => openAuthModal("forgot")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,209,102,0.24)] bg-[rgba(255,209,102,0.08)] px-3 py-2.5 text-sm font-bold text-[#ffd166] transition-all hover:border-[#ffd166] hover:bg-[rgba(255,209,102,0.14)]"
                  >
                    <FaKey size={13} />
                    Forgot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {authModalMode && (
        <AuthModal
          mode={authModalMode}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {searchDetailsMeal && (
        <ViewDetailsModal
          idMeal={searchDetailsMeal.idMeal}
          offer={{
            meal: searchDetailsMeal,
            cartFood: {
              idMeal: searchDetailsMeal.idMeal,
              strMeal: searchDetailsMeal.strMeal,
              strMealThumb: searchDetailsMeal.strMealThumb,
            },
            finalPrice: getSearchItemPrice(searchDetailsMeal.idMeal),
            basePrice: getSearchItemPrice(searchDetailsMeal.idMeal),
            offerLabel: "Fresh Pick",
            borderAccent: "#63e6be",
            glowColor: "rgba(99,230,190,0.34)",
          }}
          onClose={() => setSearchDetailsMeal(null)}
          onAddToCart={onAddToCart}
        />
      )}

      {/* ── Security Panel ──────────────────────────────────── */}
      {securityOpen &&
        currentUser &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-start justify-end bg-[rgba(2,8,20,0.75)] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (
                e.target === e.currentTarget &&
                !isSavingSecurity &&
                !showDeleteConfirm
              )
                setSecurityOpen(false);
            }}
          >
            <div className="relative flex h-full w-full max-w-md flex-col bg-[linear-gradient(170deg,rgba(14,22,42,0.99),rgba(9,14,28,0.99))] shadow-[0_0_80px_rgba(2,8,20,0.8)] animate-[slideInRight_0.28s_cubic-bezier(0.22,1,0.36,1)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(99,170,255,0.15)_0%,transparent_70%)] blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-24 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,100,100,0.08)_0%,transparent_70%)] blur-3xl" />

              {/* Header */}
              <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#1a2840] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(148,163,255,0.1)] text-[#94a3ff]">
                    <FaShield size={16} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#eef2ff]">
                      Security
                    </h2>
                    <p className="text-[0.68rem] text-[#617393]">
                      Password &amp; account safety
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !isSavingSecurity && setSecurityOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-[#1c2b43] text-[#617393] transition hover:border-[#3e5070] hover:text-[#dce6ff]"
                  aria-label="Close security"
                >
                  <FaXmark size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-6">
                {/* Change Password */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaLock size={12} className="text-[#94a3ff]" />
                    <h3 className="text-sm font-bold text-[#c8d3eb] uppercase tracking-wider">
                      Change Password
                    </h3>
                  </div>

                  {securitySuccess && (
                    <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-[rgba(99,230,190,0.08)] border border-[#63e6be]/20 px-3.5 py-2.5">
                      <FaCircleCheck
                        size={13}
                        className="shrink-0 text-[#63e6be]"
                      />
                      <p className="text-xs font-semibold text-[#63e6be]">
                        {securitySuccess}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Current password */}
                    <div>
                      <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSecPw.current ? "text" : "password"}
                          value={securityForm.currentPassword}
                          onChange={(e) => {
                            setSecurityForm((p) => ({
                              ...p,
                              currentPassword: e.target.value,
                            }));
                            setSecurityErrors((p) => ({
                              ...p,
                              currentPassword: undefined,
                            }));
                            setSecuritySuccess("");
                          }}
                          placeholder="Enter current password"
                          className={`w-full rounded-xl border bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 pr-10 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:ring-1 ${securityErrors.currentPassword ? "border-[#ff7f7f] focus:border-[#ff7f7f] focus:ring-[#ff7f7f]/20" : "border-[#1c2b43] focus:border-[#94a3ff] focus:ring-[#94a3ff]/15"}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSecPw((p) => ({ ...p, current: !p.current }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3e5070] hover:text-[#9ba5be]"
                        >
                          {showSecPw.current ? (
                            <FaEyeSlash size={14} />
                          ) : (
                            <FaEye size={14} />
                          )}
                        </button>
                      </div>
                      {securityErrors.currentPassword && (
                        <p className="mt-1 text-[0.68rem] text-[#ff8f8f]">
                          {securityErrors.currentPassword}
                        </p>
                      )}
                    </div>
                    {/* New password */}
                    <div>
                      <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSecPw.next ? "text" : "password"}
                          value={securityForm.newPassword}
                          onChange={(e) => {
                            setSecurityForm((p) => ({
                              ...p,
                              newPassword: e.target.value,
                            }));
                            setSecurityErrors((p) => ({
                              ...p,
                              newPassword: undefined,
                            }));
                          }}
                          placeholder="Min. 6 characters"
                          className={`w-full rounded-xl border bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 pr-10 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:ring-1 ${securityErrors.newPassword ? "border-[#ff7f7f] focus:border-[#ff7f7f] focus:ring-[#ff7f7f]/20" : "border-[#1c2b43] focus:border-[#94a3ff] focus:ring-[#94a3ff]/15"}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSecPw((p) => ({ ...p, next: !p.next }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3e5070] hover:text-[#9ba5be]"
                        >
                          {showSecPw.next ? (
                            <FaEyeSlash size={14} />
                          ) : (
                            <FaEye size={14} />
                          )}
                        </button>
                      </div>
                      {securityErrors.newPassword && (
                        <p className="mt-1 text-[0.68rem] text-[#ff8f8f]">
                          {securityErrors.newPassword}
                        </p>
                      )}
                    </div>
                    {/* Confirm password */}
                    <div>
                      <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSecPw.confirm ? "text" : "password"}
                          value={securityForm.confirmPassword}
                          onChange={(e) => {
                            setSecurityForm((p) => ({
                              ...p,
                              confirmPassword: e.target.value,
                            }));
                            setSecurityErrors((p) => ({
                              ...p,
                              confirmPassword: undefined,
                            }));
                          }}
                          placeholder="Repeat new password"
                          className={`w-full rounded-xl border bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 pr-10 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:ring-1 ${securityErrors.confirmPassword ? "border-[#ff7f7f] focus:border-[#ff7f7f] focus:ring-[#ff7f7f]/20" : "border-[#1c2b43] focus:border-[#94a3ff] focus:ring-[#94a3ff]/15"}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSecPw((p) => ({ ...p, confirm: !p.confirm }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3e5070] hover:text-[#9ba5be]"
                        >
                          {showSecPw.confirm ? (
                            <FaEyeSlash size={14} />
                          ) : (
                            <FaEye size={14} />
                          )}
                        </button>
                      </div>
                      {securityErrors.confirmPassword && (
                        <p className="mt-1 text-[0.68rem] text-[#ff8f8f]">
                          {securityErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={isSavingSecurity}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,rgba(148,163,255,0.9),rgba(99,120,255,0.9))] py-2.5 text-sm font-black text-white shadow-[0_8px_20px_rgba(148,163,255,0.2)] transition hover:brightness-110 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSavingSecurity ? (
                        <>
                          <FaSpinner size={13} className="animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaLock size={12} /> Update Password
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <div className="border-t border-[#1a2840]" />

                {/* Active Session Info */}
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <FaKey size={12} className="text-[#ffd166]" />
                    <h3 className="text-sm font-bold text-[#c8d3eb] uppercase tracking-wider">
                      Active Session
                    </h3>
                  </div>
                  <div className="rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.025)] px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#617393]">
                        Signed in as
                      </span>
                      <span className="text-xs font-semibold text-[#c8d3eb]">
                        {currentUser.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#617393]">
                        Session type
                      </span>
                      <span className="text-xs font-semibold text-[#63e6be]">
                        {window.localStorage.getItem("e-vendoza-auth-session")
                          ? "Persistent (Remember me)"
                          : "Temporary"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#617393]">Status</span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4ade80]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />{" "}
                        Active
                      </span>
                    </div>
                  </div>
                </section>

                <div className="border-t border-[#1a2840]" />

                {/* Danger Zone */}
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <FaCircleExclamation size={12} className="text-[#ff6b6b]" />
                    <h3 className="text-sm font-bold text-[#ff9a9a] uppercase tracking-wider">
                      Danger Zone
                    </h3>
                  </div>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="group flex w-full items-center gap-2.5 rounded-xl border border-[#3a1c1c] bg-[rgba(255,80,80,0.05)] px-4 py-3 text-sm font-semibold text-[#ff7070] transition hover:bg-[rgba(255,80,80,0.1)] hover:border-[#ff6b6b]/40"
                    >
                      <FaUserMinus size={13} className="shrink-0" />
                      <span className="flex-1 text-left">Delete Account</span>
                      <span className="text-[0.65rem] text-[#7a4a4a]">
                        Permanent
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-[#ff6b6b]/30 bg-[rgba(255,80,80,0.07)] p-4 space-y-3">
                      <p className="text-sm font-semibold text-[#ff9a9a]">
                        Are you sure?
                      </p>
                      <p className="text-xs text-[#a05050]">
                        This will permanently delete your account, profile data,
                        and order history. This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 rounded-xl border border-[#1c2b43] py-2 text-xs font-semibold text-[#617393] transition hover:text-[#dce6ff]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex-1 rounded-xl bg-[rgba(255,60,60,0.8)] py-2 text-xs font-black text-white transition hover:bg-[rgba(255,60,60,1)]"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ── Settings Panel ──────────────────────────────────── */}
      {settingsOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-start justify-end bg-[rgba(2,8,20,0.75)] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSettingsOpen(false);
            }}
          >
            <div className="relative flex h-full w-full max-w-md flex-col bg-[linear-gradient(170deg,rgba(14,22,42,0.99),rgba(9,14,28,0.99))] shadow-[0_0_80px_rgba(2,8,20,0.8)] animate-[slideInRight_0.28s_cubic-bezier(0.22,1,0.36,1)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.12)_0%,transparent_70%)] blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-24 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.08)_0%,transparent_70%)] blur-3xl" />

              {/* Header */}
              <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#1a2840] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(255,143,106,0.1)] text-[#ff8f6a]">
                    <FaGear size={16} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#eef2ff]">
                      Settings
                    </h2>
                    <p className="text-[0.68rem] text-[#617393]">
                      Notifications &amp; preferences
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-[#1c2b43] text-[#617393] transition hover:border-[#3e5070] hover:text-[#dce6ff]"
                  aria-label="Close settings"
                >
                  <FaXmark size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-6">
                {/* Notifications */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaBell size={12} className="text-[#ffd166]" />
                    <h3 className="text-sm font-bold text-[#c8d3eb] uppercase tracking-wider">
                      Notifications
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {[
                      {
                        key: "orderNotify",
                        label: "Order updates",
                        desc: "Confirmations and status changes",
                      },
                      {
                        key: "promoNotify",
                        label: "Promotions & offers",
                        desc: "Deals, discounts and special menus",
                      },
                    ].map(({ key, label, desc }) => (
                      <button
                        key={key}
                        onClick={() => saveSetting(key, !settings[key])}
                        className="flex w-full items-center gap-3 rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-left transition hover:bg-[rgba(255,255,255,0.04)]"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#c8d3eb]">
                            {label}
                          </p>
                          <p className="text-[0.68rem] text-[#617393]">
                            {desc}
                          </p>
                        </div>
                        {settings[key] ? (
                          <FaToggleOn
                            size={22}
                            className="shrink-0 text-[#63e6be]"
                          />
                        ) : (
                          <FaToggleOff
                            size={22}
                            className="shrink-0 text-[#3e5070]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="border-t border-[#1a2840]" />

                {/* App Preferences */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaGear size={12} className="text-[#ff8f6a]" />
                    <h3 className="text-sm font-bold text-[#c8d3eb] uppercase tracking-wider">
                      App Preferences
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {[
                      {
                        key: "soundFx",
                        label: "Sound effects",
                        desc: "Play sounds on cart & order actions",
                      },
                      {
                        key: "compactCart",
                        label: "Compact cart view",
                        desc: "Show smaller item rows in the cart",
                      },
                    ].map(({ key, label, desc }) => (
                      <button
                        key={key}
                        onClick={() => saveSetting(key, !settings[key])}
                        className="flex w-full items-center gap-3 rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-left transition hover:bg-[rgba(255,255,255,0.04)]"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#c8d3eb]">
                            {label}
                          </p>
                          <p className="text-[0.68rem] text-[#617393]">
                            {desc}
                          </p>
                        </div>
                        {settings[key] ? (
                          <FaToggleOn
                            size={22}
                            className="shrink-0 text-[#63e6be]"
                          />
                        ) : (
                          <FaToggleOff
                            size={22}
                            className="shrink-0 text-[#3e5070]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="border-t border-[#1a2840]" />

                {/* Data Management */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <FaDatabase size={11} className="text-[#9ba5be]" />
                    <h3 className="text-sm font-bold text-[#c8d3eb] uppercase tracking-wider">
                      Data Management
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#c8d3eb]">
                          Cart
                        </p>
                        <p className="text-[0.68rem] text-[#617393]">
                          {addToCartItems.length} item
                          {addToCartItems.length !== 1 ? "s" : ""} saved
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClearCart?.();
                          toast.info("Cart cleared");
                        }}
                        disabled={addToCartItems.length === 0}
                        className="rounded-lg border border-[#3a1c1c] bg-[rgba(255,80,80,0.06)] px-3 py-1.5 text-xs font-semibold text-[#ff7070] transition hover:bg-[rgba(255,80,80,0.12)] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#c8d3eb]">
                          Favourites
                        </p>
                        <p className="text-[0.68rem] text-[#617393]">
                          {favoriteItems.length} item
                          {favoriteItems.length !== 1 ? "s" : ""} saved
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClearFavorites?.();
                          toast.info("Favourites cleared");
                        }}
                        disabled={favoriteItems.length === 0}
                        className="rounded-lg border border-[#3a1c1c] bg-[rgba(255,80,80,0.06)] px-3 py-1.5 text-xs font-semibold text-[#ff7070] transition hover:bg-[rgba(255,80,80,0.12)] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#c8d3eb]">
                          Order History
                        </p>
                        <p className="text-[0.68rem] text-[#617393]">
                          {orderHistory.length} order
                          {orderHistory.length !== 1 ? "s" : ""} stored
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setOrderHistory([]);
                          window.localStorage.removeItem(
                            "e-vendoza-order-history",
                          );
                          toast.info("Order history cleared");
                        }}
                        disabled={orderHistory.length === 0}
                        className="rounded-lg border border-[#3a1c1c] bg-[rgba(255,80,80,0.06)] px-3 py-1.5 text-xs font-semibold text-[#ff7070] transition hover:bg-[rgba(255,80,80,0.12)] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ── My Profile Panel ────────────────────────────────── */}
      {myProfileOpen &&
        currentUser &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-start justify-end bg-[rgba(2,8,20,0.75)] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSavingProfile)
                setMyProfileOpen(false);
            }}
          >
            <div className="relative flex h-full w-full max-w-md flex-col bg-[linear-gradient(170deg,rgba(14,22,42,0.99),rgba(9,14,28,0.99))] shadow-[0_0_80px_rgba(2,8,20,0.8)] animate-[slideInRight_0.28s_cubic-bezier(0.22,1,0.36,1)]">
              {/* Glow accents */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.18)_0%,transparent_70%)] blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-24 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.1)_0%,transparent_70%)] blur-3xl" />

              {/* Header */}
              <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#1a2840] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(99,230,190,0.12)] text-[#63e6be]">
                    <FaUser size={16} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#eef2ff]">
                      My Profile
                    </h2>
                    <p className="text-[0.68rem] text-[#617393]">
                      {isEditingProfile
                        ? "Edit your information"
                        : "Account details"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#223252] bg-[rgba(99,230,190,0.08)] px-3 py-1.5 text-xs font-semibold text-[#63e6be] transition hover:border-[#63e6be]/40 hover:bg-[rgba(99,230,190,0.14)]"
                    >
                      <FaPencil size={10} />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!isSavingProfile) {
                        setIsEditingProfile(false);
                        setProfileErrors({});
                        setMyProfileOpen(false);
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-[#1c2b43] text-[#617393] transition hover:border-[#3e5070] hover:text-[#dce6ff]"
                    aria-label="Close profile"
                  >
                    <FaXmark size={15} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {/* Avatar + account status block */}
                <div className="mb-6 rounded-2xl border border-[#1a2c47] bg-[linear-gradient(145deg,rgba(15,25,46,0.84),rgba(8,14,28,0.84))] p-4 shadow-[0_12px_30px_rgba(2,8,20,0.35)]">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="grid h-18 w-18 place-items-center rounded-full border-2 border-[#1c3050] bg-[linear-gradient(135deg,rgba(99,230,190,0.25),rgba(255,143,106,0.2))] text-2xl font-black text-[#63e6be] shadow-[0_0_30px_rgba(99,230,190,0.2)]">
                        {currentUser.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-[#0d1a2e] bg-[#4ade80]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-[#eef2ff]">
                        {currentUser.fullName}
                      </p>
                      <p className="truncate text-xs text-[#617393]">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex items-center gap-2 rounded-xl border border-[#63e6be]/30 bg-[rgba(99,230,190,0.08)] px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-[#63e6be] animate-pulse" />
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#63e6be]">
                        Active Session
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[#ffd166]/25 bg-[rgba(255,209,102,0.08)] px-3 py-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[rgba(255,209,102,0.15)] text-[#ffd166]">
                        <FaCircleCheck size={10} />
                      </span>
                      <div>
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#ffd166]">
                          Account Status
                        </p>
                        <p className="text-[0.7rem] font-semibold text-[#f4d88b]">
                          Active Member
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info / Edit fields */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                      <FaUser size={9} /> Full Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => {
                          setProfileForm((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }));
                          if (profileErrors.fullName)
                            setProfileErrors((p) => ({
                              ...p,
                              fullName: undefined,
                            }));
                        }}
                        maxLength={60}
                        placeholder="Your full name"
                        className={`w-full rounded-xl border bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:ring-1 ${profileErrors.fullName ? "border-[#ff7f7f] focus:border-[#ff7f7f] focus:ring-[#ff7f7f]/20" : "border-[#1c2b43] focus:border-[#63e6be] focus:ring-[#63e6be]/15"}`}
                      />
                    ) : (
                      <div className="rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.025)] px-3.5 py-2.5 text-sm text-[#c8d3eb]">
                        {currentUser.fullName}
                      </div>
                    )}
                    {profileErrors.fullName && (
                      <p className="mt-1 text-[0.68rem] text-[#ff8f8f]">
                        {profileErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email — always read-only */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                      <FaEnvelope size={9} /> Email Address
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.025)] px-3.5 py-2.5">
                      <span className="flex-1 text-sm text-[#c8d3eb]">
                        {currentUser.email}
                      </span>
                      <span className="shrink-0 rounded-full bg-[rgba(255,209,102,0.1)] px-2 py-0.5 text-[0.6rem] font-semibold text-[#ffd166] border border-[#ffd166]/20">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                      <FaPhone size={9} /> Phone Number
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => {
                          setProfileForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }));
                          if (profileErrors.phone)
                            setProfileErrors((p) => ({
                              ...p,
                              phone: undefined,
                            }));
                        }}
                        maxLength={20}
                        placeholder="e.g. +880 1700 000000"
                        className={`w-full rounded-xl border bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:ring-1 ${profileErrors.phone ? "border-[#ff7f7f] focus:border-[#ff7f7f] focus:ring-[#ff7f7f]/20" : "border-[#1c2b43] focus:border-[#63e6be] focus:ring-[#63e6be]/15"}`}
                      />
                    ) : (
                      <div className="rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.025)] px-3.5 py-2.5 text-sm text-[#c8d3eb]">
                        {profileForm.phone || (
                          <span className="text-[#3e5070]">Not set</span>
                        )}
                      </div>
                    )}
                    {profileErrors.phone && (
                      <p className="mt-1 text-[0.68rem] text-[#ff8f8f]">
                        {profileErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                      <FaLocationDot size={9} /> Location
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                        maxLength={80}
                        placeholder="e.g. Dhaka, Bangladesh"
                        className="w-full rounded-xl border border-[#1c2b43] bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:border-[#63e6be] focus:ring-1 focus:ring-[#63e6be]/15"
                      />
                    ) : (
                      <div className="rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.025)] px-3.5 py-2.5 text-sm text-[#c8d3eb]">
                        {profileForm.location || (
                          <span className="text-[#3e5070]">Not set</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[#617393]">
                      <FaPencil size={9} /> About Me
                    </label>
                    {isEditingProfile ? (
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, bio: e.target.value }))
                        }
                        maxLength={160}
                        rows={3}
                        placeholder="A short bio about yourself..."
                        className="w-full resize-none rounded-xl border border-[#1c2b43] bg-[rgba(255,255,255,0.04)] px-3.5 py-2.5 text-sm text-[#dce6ff] placeholder-[#3e5070] outline-none transition focus:border-[#63e6be] focus:ring-1 focus:ring-[#63e6be]/15"
                      />
                    ) : (
                      <div className="min-h-18 rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.025)] px-3.5 py-2.5 text-sm text-[#c8d3eb]">
                        {profileForm.bio || (
                          <span className="text-[#3e5070]">
                            No bio yet. Click Edit to add one.
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Activity summary */}
                  <div className="flex items-center gap-3 rounded-xl border border-[#192840] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(99,230,190,0.08)] text-[#63e6be]">
                      <FaCircleCheck size={13} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#c8d3eb]">
                        Profile Activity
                      </p>
                      <p className="text-[0.68rem] text-[#617393]">
                        Orders and saved favourites
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs font-semibold text-[#c8d3eb]">
                        {orderHistory.length} Orders
                      </p>
                      <p className="text-[0.68rem] text-[#617393]">
                        {favoriteItems.length} Favourites
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer — Save / Cancel */}
              {isEditingProfile && (
                <div className="relative z-10 shrink-0 border-t border-[#1a2840] px-5 py-3 sm:px-6">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileErrors({});
                        // Reset form to saved values
                        const extra = loadExtendedProfile(currentUser.email);
                        setProfileForm({
                          fullName: currentUser.fullName,
                          phone: extra.phone ?? "",
                          location: extra.location ?? "",
                          bio: extra.bio ?? "",
                        });
                      }}
                      disabled={isSavingProfile}
                      className="flex-1 rounded-xl border border-[#1c2b43] py-2.5 text-sm font-semibold text-[#617393] transition hover:border-[#3e5070] hover:text-[#dce6ff] disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] py-2.5 text-sm font-black text-[#071510] shadow-[0_8px_20px_rgba(99,230,190,0.3)] transition hover:brightness-110 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSavingProfile ? (
                        <>
                          <FaSpinner size={13} className="animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaCheck size={13} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}

      {/* ── Order History Panel ────────────────────────────── */}
      {orderHistoryOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-start justify-end bg-[rgba(2,8,20,0.75)] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOrderHistoryOpen(false);
            }}
          >
            {/* Slide-in drawer */}
            <div className="relative flex h-full w-full max-w-md flex-col bg-[linear-gradient(170deg,rgba(14,22,42,0.99),rgba(9,14,28,0.99))] shadow-[0_0_80px_rgba(2,8,20,0.8)] animate-[slideInRight_0.28s_cubic-bezier(0.22,1,0.36,1)]">
              {/* Glow accents */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,209,102,0.18)_0%,transparent_70%)] blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.1)_0%,transparent_70%)] blur-3xl" />

              {/* Header */}
              <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#1a2840] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(255,209,102,0.12)] text-[#ffd166]">
                    <FaClockRotateLeft size={16} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#eef2ff]">
                      Order History
                    </h2>
                    <p className="text-[0.68rem] text-[#617393]">
                      {orderHistory.length} order
                      {orderHistory.length !== 1 ? "s" : ""} placed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOrderHistoryOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-[#1c2b43] text-[#617393] transition hover:border-[#3e5070] hover:text-[#dce6ff]"
                  aria-label="Close order history"
                >
                  <FaXmark size={15} />
                </button>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 sm:px-5 space-y-3">
                {orderHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-[#1c2b43] bg-[rgba(255,209,102,0.07)] text-[#ffd166]">
                      <FaClockRotateLeft size={26} />
                    </div>
                    <p className="text-sm font-semibold text-[#c8d3eb]">
                      No orders yet
                    </p>
                    <p className="mt-1 text-xs text-[#617393]">
                      Your completed orders will appear here.
                    </p>
                  </div>
                ) : (
                  orderHistory.map((order) => {
                    const orderDate = new Date(order.date);
                    const dateStr = orderDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const timeStr = orderDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-[#192840] bg-[rgba(255,255,255,0.025)] p-4 transition hover:border-[#253a58] hover:bg-[rgba(255,255,255,0.04)]"
                      >
                        {/* Order meta row */}
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#ffd166]">
                              Order #{order.id}
                            </span>
                            <p className="mt-0.5 text-[0.68rem] text-[#617393]">
                              {dateStr} · {timeStr}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-[rgba(99,230,190,0.1)] px-2.5 py-0.5 text-[0.65rem] font-semibold text-[#63e6be] border border-[#63e6be]/20">
                            {order.status}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="mb-3 space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-9 w-9 shrink-0 rounded-lg object-cover border border-[#1c2b43]"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[rgba(255,209,102,0.08)] text-[#ffd166] border border-[#1c2b43]">
                                  <FaUtensils size={12} />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-[#c8d3eb]">
                                  {item.name}
                                </p>
                                <p className="text-[0.65rem] text-[#617393]">
                                  ×{item.quantity}
                                </p>
                              </div>
                              <span className="shrink-0 text-xs font-semibold text-[#dce6ff]">
                                ৳{(item.price * item.quantity).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-2 border-t border-[#1a2840] pt-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-[0.67rem] text-[#617393]">
                            <FaLocationDot
                              size={10}
                              className="shrink-0 text-[#ff8f6a]"
                            />
                            <span className="truncate max-w-35 sm:max-w-50">
                              {order.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <FaCreditCard
                              size={10}
                              className="text-[#9ba5be]"
                            />
                            <span className="text-[0.67rem] text-[#9ba5be]">
                              {order.payment}
                            </span>
                            <span className="ml-2 text-xs font-bold text-[#63e6be]">
                              ৳{order.total.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer — Clear History */}
              {orderHistory.length > 0 && (
                <div className="relative z-10 shrink-0 border-t border-[#1a2840] px-4 py-3 sm:px-5">
                  <button
                    onClick={() => {
                      setOrderHistory([]);
                      window.localStorage.removeItem("e-vendoza-order-history");
                      toast.info("Order history cleared");
                    }}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a1c1c] bg-[rgba(255,80,80,0.06)] py-2.5 text-sm font-semibold text-[#ff7070] transition hover:bg-[rgba(255,80,80,0.12)] hover:border-[#ff6b6b]/40"
                  >
                    <FaTrashCan
                      size={13}
                      className="transition group-hover:scale-110"
                    />
                    Clear All History
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
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
