import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldHeart,
  FaTriangleExclamation,
  FaUser,
  FaXmark,
} from "react-icons/fa6";

const AUTH_STORAGE_KEY = "e-vendoza-auth-users";
const AUTH_SESSION_STORAGE_KEY = "e-vendoza-auth-session";

const DEFAULT_USER = {
  fullName: "Demo User",
  email: "user@gmail.com",
  password: "12345678",
};

const getStoredUsers = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setStoredUsers = (users) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
};

const AUTH_COPY = {
  login: {
    eyebrow: "Welcome Back",
    title: "Log in to continue ordering",
    description:
      "Access saved addresses, faster checkout, and your favorite meals in seconds.",
    primaryAction: "Log In",
    secondaryLabel: "Need an account?",
    secondaryAction: "Create one",
  },
  signup: {
    eyebrow: "Join E-Vendoza",
    title: "Create your account",
    description:
      "Sign up to track orders, collect deals, and keep your delivery details ready.",
    primaryAction: "Create Account",
    secondaryLabel: "Already registered?",
    secondaryAction: "Log in",
  },
  forgot: {
    eyebrow: "Password Help",
    title: "Reset your password",
    description:
      "Enter your email and we will send a secure reset link to get you back in.",
    primaryAction: "Send Reset Link",
    secondaryLabel: "Remembered it?",
    secondaryAction: "Back to login",
  },
};

const INPUT_BASE_CLASS =
  "w-full rounded-2xl border bg-[rgba(10,16,30,0.68)] px-4 py-3 text-sm text-[#eef2ff] placeholder:text-[#617393] outline-none transition-colors";

const AuthModal = ({ mode = "login", onClose, onLoginSuccess }) => {
  const [activeMode, setActiveMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [statusTone, setStatusTone] = useState("success");
  const [errors, setErrors] = useState({});
  const submitTimerRef = useRef(null);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotForm, setForgotForm] = useState({
    email: "",
  });

  useEffect(() => {
    setActiveMode(mode);
    setErrors({});
    setSuccessMessage("");
    setStatusTone("success");
  }, [mode]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const activeCopy = AUTH_COPY[activeMode];

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const switchMode = (nextMode) => {
    setActiveMode(nextMode);
    setErrors({});
    setSuccessMessage("");
    setStatusTone("success");
    setIsSubmitting(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (activeMode === "login") {
      if (!validateEmail(loginForm.email)) {
        nextErrors.email = "Enter a valid email address";
      }
      if (loginForm.password.trim().length < 6) {
        nextErrors.password = "Password must be at least 6 characters";
      }
    }

    if (activeMode === "signup") {
      if (!signupForm.fullName.trim()) {
        nextErrors.fullName = "Full name is required";
      }
      if (!validateEmail(signupForm.email)) {
        nextErrors.email = "Enter a valid email address";
      }
      if (signupForm.password.trim().length < 6) {
        nextErrors.password = "Password must be at least 6 characters";
      }
      if (signupForm.confirmPassword !== signupForm.password) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (activeMode === "forgot") {
      if (!validateEmail(forgotForm.email)) {
        nextErrors.email = "Enter a valid email address";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setStatusTone("success");

    submitTimerRef.current = setTimeout(() => {
      const storedUsers = getStoredUsers();
      setIsSubmitting(false);

      if (activeMode === "login") {
        const allUsers = [DEFAULT_USER, ...getStoredUsers()];
        const matchedUser = allUsers.find(
          (user) =>
            user.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
            user.password === loginForm.password,
        );

        if (!matchedUser) {
          setStatusTone("error");
          setSuccessMessage(
            "Incorrect email or password. Please try again or reset your password.",
          );
          return;
        }

        setStatusTone("success");
        setSuccessMessage(
          "Login successful. Redirecting you to the home page.",
        );

        const sessionPayload = JSON.stringify({
          fullName: matchedUser.fullName,
          email: matchedUser.email,
        });

        if (loginForm.remember) {
          window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, sessionPayload);
          window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        } else {
          window.sessionStorage.setItem(
            AUTH_SESSION_STORAGE_KEY,
            sessionPayload,
          );
          window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        }

        submitTimerRef.current = setTimeout(() => {
          onLoginSuccess?.({
            fullName: matchedUser.fullName,
            email: matchedUser.email,
          });
          onClose?.();
        }, 700);
      }

      if (activeMode === "signup") {
        const email = signupForm.email.trim().toLowerCase();
        const existingUser = storedUsers.find(
          (user) => user.email.toLowerCase() === email,
        );

        if (existingUser) {
          setStatusTone("error");
          setSuccessMessage(
            "An account with this email already exists. Please log in instead.",
          );
          return;
        }

        const nextUser = {
          fullName: signupForm.fullName.trim(),
          email,
          password: signupForm.password,
          createdAt: new Date().toISOString(),
        };

        setStoredUsers([...storedUsers, nextUser]);
        setLoginForm((prev) => ({
          ...prev,
          email: email,
          password: "",
        }));
        setSignupForm({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setStatusTone("success");
        setSuccessMessage(
          "Account created successfully. Please log in with your new credentials.",
        );
        setActiveMode("login");
      }

      if (activeMode === "forgot") {
        const matchedUser = storedUsers.find(
          (user) =>
            user.email.toLowerCase() === forgotForm.email.trim().toLowerCase(),
        );

        if (!matchedUser) {
          setStatusTone("error");
          setSuccessMessage(
            "We could not find an account with that email address.",
          );
          return;
        }

        setStatusTone("success");
        setSuccessMessage(
          "Password reset request received. Please check your inbox and spam folder.",
        );
      }
    }, 900);
  };

  const renderFieldError = (key) =>
    errors[key] ? (
      <p className="mt-1.5 text-xs font-medium text-[#ff9f97]">{errors[key]}</p>
    ) : null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 overflow-y-auto bg-[rgba(2,8,20,0.84)] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-5 lg:p-8">
        <div
          className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-[#1c2b43] bg-[linear-gradient(160deg,rgba(14,22,39,0.99),rgba(8,13,24,0.99))] shadow-[0_32px_80px_rgba(2,8,20,0.7)] lg:grid-cols-[0.95fr_1.05fr]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="pointer-events-none absolute -left-10 top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(99,230,190,0.18)_0%,transparent_70%)] blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,143,106,0.16)_0%,transparent_70%)] blur-3xl" />

          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#2b3d5e] bg-[rgba(10,16,30,0.7)] text-[#c8d3eb] transition-colors hover:border-[#ff8f6a] hover:text-[#ff8f6a]"
            aria-label="Close authentication"
          >
            <FaXmark size={16} />
          </button>

          <aside className="relative hidden overflow-hidden border-r border-[#1a263e] p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#ff8f6a]">
                E-Vendoza Access
              </p>
              <h2 className="mt-4 max-w-sm text-4xl font-black leading-[1.05] text-[#f5f7ff]">
                Secure your food delivery flow.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#92a0bb]">
                One account keeps your orders, saved locations, exclusive deals,
                and quick checkout in one polished dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Track live deliveries in one place",
                "Save favorites and delivery addresses",
                "Unlock members-only offers instantly",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[#223252] bg-[rgba(10,16,30,0.6)] px-4 py-3"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[rgba(99,230,190,0.12)] text-[#63e6be] shadow-[0_0_22px_rgba(99,230,190,0.12)]">
                    <FaShieldHeart size={16} />
                  </span>
                  <p className="text-sm font-semibold text-[#d5ddf5]">{item}</p>
                </div>
              ))}

              <div className="rounded-3xl border border-[rgba(99,230,190,0.18)] bg-[linear-gradient(135deg,rgba(99,230,190,0.1),rgba(77,217,172,0.04))] p-5">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#63e6be]">
                  Fast Access
                </p>
                <p className="mt-2 text-2xl font-black text-[#f5f7ff]">
                  30 seconds
                </p>
                <p className="mt-1 text-sm text-[#9ba5be]">
                  is all it takes to get back to ordering with your saved
                  profile.
                </p>
              </div>
            </div>
          </aside>

          <section className="relative p-5 sm:p-7 lg:p-8">
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                { id: "login", label: "Log In" },
                { id: "signup", label: "Sign Up" },
                { id: "forgot", label: "Forgot Password" },
              ].map((item) => {
                const active = activeMode === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchMode(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                      active
                        ? "bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] text-[#071510] shadow-[0_8px_24px_rgba(99,230,190,0.24)]"
                        : "border border-[#233453] bg-[rgba(10,16,30,0.6)] text-[#9ba5be] hover:border-[#3d5480] hover:text-[#e7ecff]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-3xl border border-[#223252] bg-[rgba(8,12,24,0.72)] p-5 sm:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff8f6a]">
                {activeCopy.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#f5f7ff] sm:text-[2rem]">
                {activeCopy.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#92a0bb]">
                {activeCopy.description}
              </p>

              {successMessage && (
                <div
                  className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    statusTone === "success"
                      ? "border-[rgba(99,230,190,0.24)] bg-[rgba(99,230,190,0.08)] text-[#c7f7e7]"
                      : "border-[rgba(255,143,106,0.24)] bg-[rgba(255,143,106,0.08)] text-[#ffd1c2]"
                  }`}
                >
                  <FaTriangleExclamation
                    className="mt-0.5 shrink-0"
                    size={14}
                  />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {activeMode === "login" && (
                  <>
                    <div>
                      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                          size={13}
                        />
                        <input
                          type="email"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              email: event.target.value,
                            }))
                          }
                          placeholder="name@example.com"
                          className={`${INPUT_BASE_CLASS} pl-11 ${errors.email ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                        />
                      </div>
                      {renderFieldError("email")}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                        Password
                      </label>
                      <div className="relative">
                        <FaLock
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                          size={13}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              password: event.target.value,
                            }))
                          }
                          placeholder="Enter your password"
                          className={`${INPUT_BASE_CLASS} pl-11 pr-12 ${errors.password ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7082a2] transition-colors hover:text-[#c8d3eb]"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <FaEyeSlash size={14} />
                          ) : (
                            <FaEye size={14} />
                          )}
                        </button>
                      </div>
                      {renderFieldError("password")}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="inline-flex items-center gap-2 text-sm text-[#93a3c2]">
                        <input
                          type="checkbox"
                          checked={loginForm.remember}
                          onChange={(event) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              remember: event.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-[#2b3d5e] bg-transparent text-[#63e6be] focus:ring-[#63e6be]"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-sm font-semibold text-[#63e6be] transition-colors hover:text-[#9cf1d2]"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </>
                )}

                {activeMode === "signup" && (
                  <>
                    <div>
                      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                        Full Name
                      </label>
                      <div className="relative">
                        <FaUser
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                          size={13}
                        />
                        <input
                          type="text"
                          value={signupForm.fullName}
                          onChange={(event) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              fullName: event.target.value,
                            }))
                          }
                          placeholder="Your full name"
                          className={`${INPUT_BASE_CLASS} pl-11 ${errors.fullName ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                        />
                      </div>
                      {renderFieldError("fullName")}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                          size={13}
                        />
                        <input
                          type="email"
                          value={signupForm.email}
                          onChange={(event) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              email: event.target.value,
                            }))
                          }
                          placeholder="name@example.com"
                          className={`${INPUT_BASE_CLASS} pl-11 ${errors.email ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                        />
                      </div>
                      {renderFieldError("email")}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                          Password
                        </label>
                        <div className="relative">
                          <FaLock
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                            size={13}
                          />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={signupForm.password}
                            onChange={(event) =>
                              setSignupForm((prev) => ({
                                ...prev,
                                password: event.target.value,
                              }))
                            }
                            placeholder="Minimum 6 characters"
                            className={`${INPUT_BASE_CLASS} pl-11 pr-12 ${errors.password ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7082a2] transition-colors hover:text-[#c8d3eb]"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? (
                              <FaEyeSlash size={14} />
                            ) : (
                              <FaEye size={14} />
                            )}
                          </button>
                        </div>
                        {renderFieldError("password")}
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FaLock
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                            size={13}
                          />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={signupForm.confirmPassword}
                            onChange={(event) =>
                              setSignupForm((prev) => ({
                                ...prev,
                                confirmPassword: event.target.value,
                              }))
                            }
                            placeholder="Repeat password"
                            className={`${INPUT_BASE_CLASS} pl-11 pr-12 ${errors.confirmPassword ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7082a2] transition-colors hover:text-[#c8d3eb]"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash size={14} />
                            ) : (
                              <FaEye size={14} />
                            )}
                          </button>
                        </div>
                        {renderFieldError("confirmPassword")}
                      </div>
                    </div>
                  </>
                )}

                {activeMode === "forgot" && (
                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-[#8191ae]">
                      Recovery Email
                    </label>
                    <div className="relative">
                      <FaEnvelope
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6f8f]"
                        size={13}
                      />
                      <input
                        type="email"
                        value={forgotForm.email}
                        onChange={(event) =>
                          setForgotForm({ email: event.target.value })
                        }
                        placeholder="name@example.com"
                        className={`${INPUT_BASE_CLASS} pl-11 ${errors.email ? "border-[#ff7f7f]" : "border-[#233453] focus:border-[#63e6be]"}`}
                      />
                    </div>
                    {renderFieldError("email")}
                    <p className="mt-3 text-sm leading-relaxed text-[#92a0bb]">
                      We will send a secure password reset link to this email if
                      the account exists.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-[#071510] shadow-[0_12px_26px_rgba(99,230,190,0.28)] transition-all duration-200 ${
                    isSubmitting
                      ? "cursor-not-allowed bg-[linear-gradient(135deg,#7ddfc0,#69cfad)] opacity-80"
                      : "bg-[linear-gradient(135deg,#63e6be,#4dd9ac)] hover:-translate-y-0.5 hover:brightness-110"
                  }`}
                >
                  {isSubmitting ? "Please wait..." : activeCopy.primaryAction}
                  {!isSubmitting && <FaArrowRight size={12} />}
                </button>
              </form>

              <div className="mt-5 border-t border-[#1c2b43] pt-5 text-center text-sm text-[#92a0bb]">
                {activeCopy.secondaryLabel}{" "}
                <button
                  type="button"
                  onClick={() =>
                    switchMode(
                      activeMode === "login"
                        ? "signup"
                        : activeMode === "signup"
                          ? "login"
                          : "login",
                    )
                  }
                  className="font-bold text-[#63e6be] transition-colors hover:text-[#9cf1d2]"
                >
                  {activeCopy.secondaryAction}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
