import { FaCheckCircle, FaCode, FaUserTie } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import usePublicJson from "../../hooks/usePublicJson";

const FALLBACK_SITE_CONTENT = {
  about: {
    eyebrow: "About E-Vendoza",
    title: "Built For Fast, Fresh, Reliable Food Delivery",
    description:
      "E-Vendoza connects hungry customers with trusted local kitchens and premium restaurants. Our focus is simple: quality meals, transparent pricing, and a smooth ordering experience from search to doorstep.",
    highlights: [
      {
        title: "Live Order Tracking",
        description:
          "Track every order in real time from confirmation to doorstep handoff.",
      },
      {
        title: "Curated Restaurant Partners",
        description:
          "We partner with trusted kitchens to maintain food quality and consistency.",
      },
      {
        title: "Secure Checkout",
        description:
          "Simple and secure checkout flow with clear totals and no hidden fees.",
      },
    ],
    stats: [
      { label: "Orders Delivered", value: "120K+" },
      { label: "Restaurant Partners", value: "500+" },
      { label: "Customer Rating", value: "4.9/5" },
      { label: "Avg Delivery", value: "30 min" },
    ],
  },
  developer: {
    label: "Crafted & Developed By",
    name: "Wasif Hasan",
    role: "Full-Stack Developer",
    location: "Bangladesh",
    bio: "Focused on building responsive interfaces, robust frontend architecture, and smooth user experiences for real-world products.",
  },
};

const About = () => {
  const siteContent = usePublicJson(
    "/data/siteContent.json",
    FALLBACK_SITE_CONTENT,
  );
  const about = siteContent?.about ?? {};
  const developer = siteContent?.developer ?? {};
  const highlights = Array.isArray(about.highlights) ? about.highlights : [];
  const stats = Array.isArray(about.stats) ? about.stats : [];

  return (
    <section
      id="about-section"
      className="relative overflow-hidden py-14 sm:py-16 md:py-20 bg-[radial-gradient(circle_at_84%_12%,#1c2438_0%,#10182b_42%,#090f1e_78%)]"
    >
      <div className="pointer-events-none absolute -left-24 top-6 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.12)_0%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.12)_0%,transparent_70%)] blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <article className="lg:col-span-8 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-5 shadow-[0_12px_30px_rgba(2,8,20,0.32)] sm:p-6 md:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
              {about.eyebrow || "About"}
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-[#f5f7ff] sm:text-3xl md:text-[2.2rem]">
              {about.title || "About E-Vendoza"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#9ba5be] sm:text-[0.95rem]">
              {about.description}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#253754] bg-[rgba(13,20,36,0.72)] p-3.5"
                >
                  <div className="inline-flex items-center gap-2 text-[#63e6be]">
                    <FaCheckCircle size={13} />
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em]">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#8e9bb8]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#253754] bg-[rgba(10,16,30,0.72)] px-3 py-3 text-center"
                >
                  <p className="text-[1rem] font-black text-[#63e6be] sm:text-[1.15rem]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[#7f90b0] sm:text-[0.68rem]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-4 rounded-2xl border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(16,24,42,0.98),rgba(9,14,27,0.98))] p-5 shadow-[0_12px_30px_rgba(2,8,20,0.32)] sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
              Developer
            </p>

            <div className="relative mt-3 overflow-hidden rounded-xl border border-[#253754] bg-[rgba(10,16,30,0.72)] p-4">
              {/* ambient glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.18)_0%,transparent_70%)] blur-2xl" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.12)_0%,transparent_70%)] blur-2xl" />

              <div className="relative">
                <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[#6f82a7]">
                  {developer.label || "Crafted by"}
                </p>

                <div className="mt-2 flex items-center gap-2.5">
                  <h3 className="text-2xl font-black text-[#eef2ff]">
                    {developer.name || "Developer"}
                  </h3>
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#63e6be] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#63e6be] shadow-[0_0_6px_rgba(99,230,190,0.7)]" />
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#9ba5be]">
                    <FaUserTie className="shrink-0 text-[#63e6be]" size={12} />
                    {developer.role || "Full-Stack Developer"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#9ba5be]">
                    <FaLocationDot
                      className="shrink-0 text-[#63e6be]"
                      size={12}
                    />
                    {developer.location || "Bangladesh"}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["React", "Tailwind CSS", "REST API"].map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-full border border-[rgba(99,230,190,0.22)] bg-[rgba(99,230,190,0.07)] px-2.5 py-1 text-[0.62rem] font-bold text-[#63e6be]/80"
                    >
                      <FaCode size={9} />
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-[#8e9bb8]">
                  {developer.bio}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;
