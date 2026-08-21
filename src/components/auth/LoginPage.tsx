import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShieldCheck, Eye, EyeOff, Mail, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, DEMO_CREDENTIALS } from "../../context/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    const result = await login(values.email, values.password, values.rememberMe);
    if (result.ok) {
      toast.success("Welcome back! Login successful.");
      navigate("/app/dashboard");
    } else {
      setServerError(result.error ?? "Login failed");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-slate-100">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AI Test Management Portal</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-3xl font-bold leading-tight mb-4">
              A practice-ground for real-world test automation.
            </h1>
            <p className="text-brand-100 text-sm leading-relaxed">
              Login, tables, modals, drag-and-drop, alerts, iframes, and more &mdash;
              every screen is built as a stable, automatable surface for your
              Playwright and Selenium suites.
            </p>
          </div>
          <p className="text-xs text-brand-200">&copy; 2026 AI Test Management Portal. Practice environment &mdash; not a production system.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="h-9 w-9 rounded-lg bg-brand-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg text-slate-800">AI Test Management Portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to access the test management console.</p>

            {serverError && (
              <div
                id="login-error-banner"
                data-testid="login-error-banner"
                role="alert"
                className="mt-4 rounded-lg bg-danger-50 border border-red-200 text-danger-700 text-sm px-3 py-2"
              >
                {serverError}
              </div>
            )}

            <form
              id="login-form"
              data-testid="login-form"
              className="mt-6 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    data-testid="login-email-input"
                    aria-label="Email address"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    placeholder="you@company.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                    })}
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" data-testid="login-email-error" className="mt-1.5 text-xs text-danger-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    id="forgot-password-link"
                    data-testid="forgot-password-link"
                    aria-label="Open forgot password dialog"
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    data-testid="login-password-input"
                    aria-label="Password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                  />
                  <button
                    type="button"
                    id="toggle-password-visibility"
                    data-testid="toggle-password-visibility"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" data-testid="login-password-error" className="mt-1.5 text-xs text-danger-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="remember-me-checkbox" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    data-testid="remember-me-checkbox"
                    aria-label="Remember me"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    {...register("rememberMe")}
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                id="login-submit-button"
                data-testid="login-submit-button"
                aria-label="Sign in"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-500">
                <p className="font-medium text-slate-600 mb-0.5">Demo credentials</p>
                <p data-testid="demo-credentials-hint">
                  {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setSubmitted(true);
    toast.info("Password reset link sent (simulated).");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      id="forgot-password-modal"
      data-testid="forgot-password-modal"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 id="forgot-password-title" className="text-lg font-semibold text-slate-900">
            Reset your password
          </h3>
          <button
            type="button"
            id="forgot-password-close-button"
            data-testid="forgot-password-close-button"
            aria-label="Close forgot password dialog"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div>
            <p className="text-sm text-slate-600 mt-2" data-testid="forgot-password-success-message">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
            <button
              type="button"
              id="forgot-password-done-button"
              data-testid="forgot-password-done-button"
              className="mt-5 w-full py-2 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form id="forgot-password-form" data-testid="forgot-password-form" onSubmit={handleSubmit} noValidate>
            <p className="text-sm text-slate-500 mb-4">
              Enter the email associated with your account and we&apos;ll send a reset link.
            </p>
            <label htmlFor="forgot-password-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="forgot-password-email"
              name="forgotEmail"
              type="email"
              data-testid="forgot-password-email-input"
              aria-label="Email address for password reset"
              aria-invalid={!!error}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            {error && (
              <p data-testid="forgot-password-email-error" className="mt-1.5 text-xs text-danger-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              id="forgot-password-submit-button"
              data-testid="forgot-password-submit-button"
              aria-label="Send password reset link"
              className="mt-5 w-full py-2 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
            >
              Send reset link
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
