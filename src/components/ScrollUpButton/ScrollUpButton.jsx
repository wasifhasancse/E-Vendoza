import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 group"
          aria-label="Scroll to top"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] opacity-0 blur-md group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />

          {/* Main button */}
          <div className="relative flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-[#63e6be] bg-[linear-gradient(135deg,rgba(99,230,190,0.15),rgba(77,217,172,0.1))] shadow-[0_0_20px_rgba(99,230,190,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,230,190,0.35)] hover:border-[#7cecc8] active:scale-95">
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border border-[#63e6be] opacity-20 animate-pulse" />
            <div className="absolute inset-0.5 rounded-full border border-[#4dd9ac] opacity-15 animate-ping" />

            {/* Icon */}
            <FaArrowUp className="relative text-[#63e6be] text-sm md:text-base transition-all duration-300 group-hover:text-[#7cecc8] group-hover:-translate-y-0.5" />
          </div>

          {/* Tooltip */}
          <div className="absolute -top-10 right-0 hidden group-hover:block whitespace-nowrap rounded-lg bg-[#1a2035] px-2 py-1 text-xs font-bold text-[#63e6be] border border-[#63e6be] shadow-lg pointer-events-none animate-fa-in">
            Top
          </div>
        </button>
      )}

      <style>{`
        @keyframes fa-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default ScrollUpButton;
