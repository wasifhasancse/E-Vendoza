import { useEffect } from "react";
import {
    FaCircleCheck,
    FaCircleExclamation,
    FaCircleInfo,
    FaXmark,
} from "react-icons/fa6";

const ICONS = {
  success: FaCircleCheck,
  error: FaCircleExclamation,
  info: FaCircleInfo,
};

const STYLES = {
  success: {
    bg: "bg-gradient-to-r from-[rgba(99,230,190,0.15)] to-[rgba(99,230,190,0.08)]",
    border: "border-[#63e6be]/40",
    text: "text-[#63e6be]",
    icon: "#63e6be",
  },
  error: {
    bg: "bg-gradient-to-r from-[rgba(255,107,107,0.15)] to-[rgba(255,107,107,0.08)]",
    border: "border-[#ff6b6b]/40",
    text: "text-[#ff6b6b]",
    icon: "#ff6b6b",
  },
  info: {
    bg: "bg-gradient-to-r from-[rgba(100,200,255,0.15)] to-[rgba(100,200,255,0.08)]",
    border: "border-[#64c8ff]/40",
    text: "text-[#64c8ff]",
    icon: "#64c8ff",
  },
};

const ToastNotification = ({
  id,
  message,
  type = "success",
  duration = 2500,
  isExiting,
  onRemove,
}) => {
  const Icon = ICONS[type] || ICONS.info;
  const style = STYLES[type] || STYLES.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onRemove]);

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isExiting ? "translate-x-96 opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <article
        className={`relative overflow-hidden rounded-xl border ${style.bg} ${style.border} px-4 py-3 flex items-center gap-3 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.32)]`}
      >
        {/* Animated left border accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background: style.icon,
            animation: "slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />

        {/* Icon */}
        <div className="shrink-0">
          <Icon size={20} className={style.text} />
        </div>

        {/* Message */}
        <p className={`text-sm font-semibold ${style.text} line-clamp-2`}>
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={() => onRemove?.()}
          className={`ml-auto shrink-0 rounded-lg p-1 transition-all hover:bg-[rgba(255,255,255,0.08)]`}
          aria-label="Close notification"
        >
          <FaXmark size={14} className={style.text} />
        </button>

        {/* Auto-close progress bar */}
        {duration > 0 && (
          <style>{`
            @keyframes slideIn {
              0% { transform: scaleY(0); }
              100% { transform: scaleY(1); }
            }

            @keyframes progress {
              0% { width: 100%; }
              100% { width: 0%; }
            }

            .toast-progress-${id} {
              animation: progress ${duration}ms linear forwards;
            }
          `}</style>
        )}
      </article>
    </div>
  );
};

export default ToastNotification;
