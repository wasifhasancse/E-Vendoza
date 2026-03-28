import { FaBolt, FaCartShopping, FaMagnifyingGlass } from "react-icons/fa6";

const NAV_LINKS = ["Home", "Menu", "Food", "About"];

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1c2b43] bg-[rgba(9,14,28,0.92)] backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ── Logo ── */}
          <a className="shrink-0 inline-flex items-center gap-2 cursor-pointer">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] text-[#061510] shadow-[0_4px_14px_rgba(99,230,190,0.38)]">
              <FaBolt size={14} />
            </span>
            <span className="text-xl md:text-2xl font-black bg-[linear-gradient(130deg,#f5f7ff_40%,#63e6be_100%)] bg-clip-text text-transparent">
              E-Vendoza
            </span>
          </a>

          {/* ── Desktop nav links ── */}
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

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <FaMagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6f94]"
                size={13}
              />
              <input
                type="text"
                placeholder="Search food..."
                className="rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] pl-9 pr-4 py-2 text-sm text-[#c8d3eb] placeholder:text-[#5e6f94] outline-none focus:border-[#63e6be] transition-colors w-40 md:w-52"
              />
            </div>

            {/* Cart */}
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-colors">
              <FaCartShopping size={16} />
              <span className="absolute -right-1 -top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-[#63e6be] text-[0.58rem] font-black text-[#061510]">
                8
              </span>
            </button>

            {/* Avatar */}
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-[#63e6be]/30 cursor-pointer hover:ring-[#63e6be]/60 transition-all">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-[#1c2b43] bg-[rgba(16,24,42,0.7)] text-[#c8d3eb] hover:border-[#63e6be] hover:text-[#63e6be] transition-colors">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
