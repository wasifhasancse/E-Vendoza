import {
  FaBolt,
  FaCode,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLocationDot,
  FaPhone,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import usePublicJson from "../../hooks/usePublicJson";

const FALLBACK_SITE_CONTENT = {
  developer: {
    enabled: true,
    label: "Crafted & Developed By",
    name: "Wasif Hasan",
    role: "Full-Stack Developer",
    location: "Bangladesh",
    bio: "Focused on building responsive interfaces, robust frontend architecture, and smooth user experiences for real-world products.",
  },
  footer: {
    brandDescription:
      "Bangladesh's fast and reliable food delivery platform. Connecting customers with trusted restaurants for hot, fresh meals every day.",
    contact: {
      city: "Dhaka, Bangladesh",
      phone: "+880 1XXXXXXXXX",
      email: "support@e-vendoza.com",
    },
    columns: [],
    social: [],
    legal: [],
  },
};

const ICON_MAP = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
};

const Footer = () => {
  const year = new Date().getFullYear();
  const siteContent = usePublicJson(
    "/data/siteContent.json",
    FALLBACK_SITE_CONTENT,
  );
  const footer = siteContent?.footer ?? {};
  const developer = siteContent?.developer ?? {};
  const footerColumns = Array.isArray(footer.columns) ? footer.columns : [];
  const socialLinks = Array.isArray(footer.social) ? footer.social : [];
  const legalLinks = Array.isArray(footer.legal) ? footer.legal : [];

  const handleFooterLinkClick = (event, href) => {
    if (!href || href === "#" || !href.startsWith("#")) return;

    event.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#1c2b43] bg-[linear-gradient(180deg,#0a0f1c_0%,#07090f_100%)]">
      {/* background blobs */}
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.07)_0%,transparent_70%)] blur-[60px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.07)_0%,transparent_70%)] blur-[60px]" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        {/* ── App Download Banner ── */}
        <div className="relative mt-12 overflow-hidden rounded-2xl border border-[#1c2b43] bg-[linear-gradient(135deg,rgba(16,24,44,0.98),rgba(9,14,27,0.98))] p-6 shadow-[0_16px_40px_rgba(2,8,20,0.4)] sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-2xl bg-[radial-gradient(ellipse_at_20%_50%,rgba(99,230,190,0.07)_0%,transparent_60%)]" />
          <div className="relative">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
              Mobile App
            </p>
            <h3 className="mt-1.5 text-2xl font-black text-[#f5f7ff] sm:text-3xl">
              Order Smarter with the App
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8897b5]">
              Get exclusive app-only deals, live ride tracking, and one-tap
              reorder. Available on iOS &amp; Android — download free today.
            </p>
          </div>
          <div className="relative mt-5 flex shrink-0 flex-wrap gap-3 md:mt-0">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-xl border border-[#2b3d5e] bg-[rgba(10,16,30,0.8)] px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#63e6be]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.44c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.95M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"
                  fill="white"
                />
              </svg>
              <div>
                <p className="text-[0.62rem] text-[#8897b5]">Download on the</p>
                <p className="text-sm font-bold text-[#f5f7ff]">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-xl border border-[#2b3d5e] bg-[rgba(10,16,30,0.8)] px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#63e6be]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="m3.18 23.76.04-.03 11.1-6.4-2.35-2.35-8.79 8.78ZM1.5 2.5c-.32.34-.5.85-.5 1.52v15.96c0 .67.18 1.18.5 1.52l.08.07 8.95-8.95v-.21L1.58 2.43l-.08.07ZM21.38 10.28l-2.54-1.46-2.65 2.65 2.61 2.64 2.58-1.49c.74-.42.74-1.93 0-2.34ZM3.22.24l8.79 8.79-2.36 2.35-11.1-6.4.04-.03.04-.02L3.22.24Z"
                  fill="#00D2FF"
                />
              </svg>
              <div>
                <p className="text-[0.62rem] text-[#8897b5]">Get it on</p>
                <p className="text-sm font-bold text-[#f5f7ff]">Google Play</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Main footer columns ── */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-10">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] text-[#061510] shadow-[0_4px_14px_rgba(99,230,190,0.38)]">
                <FaBolt size={15} />
              </span>
              <span className="text-xl font-black bg-[linear-gradient(130deg,#f5f7ff_40%,#63e6be_100%)] bg-clip-text text-transparent">
                E-Vendoza
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#8897b5]">
              {footer.brandDescription}
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-[#9ba5be]">
                <FaLocationDot size={13} className="shrink-0 text-[#63e6be]" />
                {footer.contact?.city}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#9ba5be]">
                <FaPhone size={13} className="shrink-0 text-[#63e6be]" />
                {footer.contact?.phone}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#9ba5be]">
                <FaEnvelope size={13} className="shrink-0 text-[#63e6be]" />
                {footer.contact?.email}
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((social) => {
                const SocialIcon = ICON_MAP[social.icon];
                if (!SocialIcon) return null;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-[#1c2b43] bg-[rgba(10,16,30,0.7)] text-[#8897b5] transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-white"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${social.color}22`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(10,16,30,0.7)")
                    }
                  >
                    <SocialIcon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map(({ heading, links }) => (
            <div key={heading} className="space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f5f7ff]">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(event) =>
                        handleFooterLinkClick(event, link.href)
                      }
                      className="text-sm text-[#8897b5] transition-colors hover:text-[#63e6be]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#1c2b43] py-6 sm:flex-row">
          <p className="text-xs text-[#5e6f94]">
            © {year} E-Vendoza. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-[#5e6f94]">
            {legalLinks.map((item, index) => (
              <div key={item.label} className="flex items-center gap-3">
                {index > 0 && <span>·</span>}
                <a
                  href={item.href}
                  onClick={(event) => handleFooterLinkClick(event, item.href)}
                  className="hover:text-[#63e6be] transition-colors"
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#63e6be] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#63e6be]" />
            </span>
            <span className="text-xs text-[#5e6f94]">
              All systems operational
            </span>
          </div>
        </div>

        {developer.enabled && (
          <div className="pb-8 pt-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[linear-gradient(to_right,transparent,#1c2b43,transparent)]" />
              <span className="grid h-6 w-6 place-items-center rounded-full border border-[#2b3d5e] bg-[rgba(12,19,34,0.78)] text-[#63e6be]">
                <FaCode size={10} />
              </span>
              <div className="h-px flex-1 bg-[linear-gradient(to_right,transparent,#1c2b43,transparent)]" />
            </div>

            <div className="developer-signature-wrap developer-signature-card text-center">
              <p className="developer-signature-label">{developer.label}</p>

              <div className="developer-signature-shell">
                <span className="developer-signature-spark developer-signature-spark-left">
                  +
                </span>
                <span className="developer-signature inline-block">
                  {developer.name}
                </span>
                <span className="developer-signature-spark developer-signature-spark-right">
                  +
                </span>
              </div>

              <p className="developer-signature-meta">
                {developer.role}
                <span className="mx-2 text-[#4f6284]">|</span>
                {developer.location}
              </p>
              <p className="mt-1 text-[0.72rem] text-[#7f90b0]">
                {developer.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
