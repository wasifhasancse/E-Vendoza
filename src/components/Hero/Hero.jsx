import { FaClock, FaMotorcycle, FaPlay, FaStar } from "react-icons/fa";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-shell">
      <div className="hero-bg-shape hero-bg-shape-left" />
      <div className="hero-bg-shape hero-bg-shape-right" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-14 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1f2435] px-4 py-2 text-xs md:text-sm font-semibold text-[#ff8f6a] border border-[#2f354a]">
              More than faster
              <span>🔥</span>
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#f5f7ff]">
                Be The Fastest
                <br />
                In Delivering
                <br />
                Your <span className="text-[#ff8f6a]">Food</span>
              </h1>
              <p className="max-w-lg text-base md:text-lg text-[#aab1c5]">
                Craving something delicious? We deliver hot and fresh meals to
                your doorstep in minutes with trusted riders and real-time
                tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <button className="btn border-0 rounded-full px-8 text-[#0d111f] bg-[#63e6be] hover:bg-[#47d7ac] shadow-[0_10px_22px_rgba(99,230,190,0.35)]">
                Get Started
              </button>
              <button className="inline-flex items-center gap-3 text-[#e8ecfa] font-semibold hover:text-[#63e6be] transition-colors">
                <span className="w-9 h-9 rounded-full bg-[#1b2133] border border-[#303851] shadow-md grid place-items-center text-[#ffd166]">
                  <FaPlay size={12} />
                </span>
                Watch Video
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                <div className="avatar">
                  <div className="w-10 ring-2 ring-white">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                      alt="Customer 1"
                    />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-10 ring-2 ring-white">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                      alt="Customer 2"
                    />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-10 ring-2 ring-white">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                      alt="Customer 3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#f5f7ff]">Our Happy Customer</p>
                <p className="text-sm text-[#aab1c5] inline-flex items-center gap-1">
                  <FaStar className="text-[#f6b73c]" />
                  4.8 (12.5k Reviews)
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-95 sm:h-107.5 md:h-125 lg:h-140">
            <div className="hero-image-blob">
              <img
                className="w-full h-full object-cover object-center"
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80"
                alt="Fresh food platter"
              />
            </div>

            <div className="hero-float-card hero-float-card-courier">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt="Courier"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-[#f5f7ff] text-sm">
                  Richard Watson
                </p>
                <p className="text-xs text-[#aab1c5]">Food Courier</p>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#63e6be] grid place-items-center text-[#09131d]">
                <FaClock size={12} />
              </span>
            </div>

            <div className="hero-float-card hero-float-card-pizza">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=260&q=80"
                alt="Italian pizza"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-[#f5f7ff] text-sm">
                  Italian Pizza
                </p>
                <p className="text-xs text-[#aab1c5]">with extra cheese</p>
                <p className="font-bold text-[#f5f7ff] mt-1">$7.49</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 md:pt-20">
          <p className="text-center uppercase tracking-[0.22em] text-xs md:text-sm font-bold text-[#ff8f6a]">
            What we serve
          </p>
          <h2 className="mt-3 text-center text-3xl md:text-4xl font-extrabold text-[#f5f7ff]">
            Your Favorite Food
            <br />
            Delivery Partner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            <article className="hero-service-card">
              <div className="hero-service-icon text-[#f25a4f] bg-[#fff1ef]">
                <FaClock size={18} />
              </div>
              <h3>Easy To Order</h3>
              <p>Only a few taps away to place your order in seconds.</p>
            </article>

            <article className="hero-service-card">
              <div className="hero-service-icon text-[#f6b73c] bg-[#fff8e9]">
                <FaMotorcycle size={18} />
              </div>
              <h3>Fastest Delivery</h3>
              <p>Lightning speed riders ensure your food arrives on time.</p>
            </article>

            <article className="hero-service-card">
              <div className="hero-service-icon text-[#4d8ef7] bg-[#edf3ff]">
                <FaStar size={18} />
              </div>
              <h3>Best Quality</h3>
              <p>Handpicked restaurants and quality checks for every meal.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
