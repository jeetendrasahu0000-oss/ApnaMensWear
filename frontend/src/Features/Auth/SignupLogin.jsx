// SignupLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../../Api/Axios";
import styles from "./SignupLogin.module.css";
import {
  Eye,
  EyeOff,
  X,
  Mail,
  Phone,
  User,
  Lock,
  MapPin,
  Home,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { SetAccessToken } from "../../Api/TokenStore";
import { fetchUserProfile } from "../../Api/basicStore";
import { useAuth } from "../../context/AuthContext";

const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  password: "Password",
  pinCode: "Pin code",
  addressLine1: "Address line 1",
  addressLine2: "Address line 2",
  country: "Country",
  state: "State",
  city: "City",
};

const EMPTY_SIGNUP_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  country: "India",
  state: "",
  city: "",
  pinCode: "",
  addressLine1: "",
  addressLine2: "",
};

function SignupLogin({ mode: modeProp, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthUser } = useAuth();

  const detectedMode =
    modeProp || (location.pathname === "/signup" ? "signup" : "login");
  const redirectTo = location.state?.from || "/";

  // ✅ FIX: useState ki jagah direct value
  // Kyun? Route /login ↔ /signup change hone pe useState update nahi hota,
  // isliye modal content change nahi ho raha tha.
  const mode = detectedMode;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);

  const [form, setForm] = useState(EMPTY_SIGNUP_FORM);
  const [login, setLogin] = useState({ identifier: "", password: "" });

  // --------------------------------------------------
  // Close handler
  // --------------------------------------------------
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/", { replace: true });
    }
  };

  // --------------------------------------------------
  // Body scroll lock while modal is open
  // --------------------------------------------------
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // --------------------------------------------------
  // ESC key closes modal
  // --------------------------------------------------
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // Reset errors on mode change
  // --------------------------------------------------
  useEffect(() => {
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  // --------------------------------------------------
  // OTP resend timer
  // --------------------------------------------------
  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // --------------------------------------------------
  // Reset OTP when phone changes
  // --------------------------------------------------
  useEffect(() => {
    if (otpVerified) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtp(["", "", "", "", "", ""]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.phone]);

  const clearFieldError = (name) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mode === "signup") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setLogin((prev) => ({ ...prev, [name]: value }));
    }
    clearFieldError(name);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    clearFieldError("otp");
    if (digit && index < otp.length - 1) {
      document.getElementById(`otp-box-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-box-${index - 1}`)?.focus();
    }
  };

  const handleApiError = (error, fallbackField = "api") => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";
    const field = error?.response?.data?.field;
    setErrors((prev) => ({
      ...prev,
      ...(field ? { [field]: message } : {}),
      [fallbackField]: message,
    }));
  };

  const applyBackendResponse = (payload) => {
    const data = payload || {};
    const fieldErrors = {};
    if (Array.isArray(data.error)) {
      data.error.forEach((path) => {
        const fieldName = path.split(".").pop();
        const label = FIELD_LABELS[fieldName] || fieldName;
        fieldErrors[fieldName] = `${label} is required`;
      });
    }
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
      api: data.message || "Something went wrong. Please try again.",
    }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const validateSignup = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!phoneRegex.test(form.phone))
      e.phone = "Enter a valid 10-digit number";
    if (!otpVerified) e.otp = "Please verify your phone with OTP";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "At least 8 characters needed";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pinCode.trim()) e.pinCode = "Pin code is required";
    else if (!/^\d{4,6}$/.test(form.pinCode)) e.pinCode = "Enter valid pin code";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    return e;
  };

  const validateLogin = () => {
    const e = {};
    if (!login.identifier.trim()) e.identifier = "Email or phone is required";
    if (!login.password) e.password = "Password is required";
    return e;
  };

  const sendOtp = async () => {
    if (!form.phone.trim()) {
      setErrors((prev) => ({ ...prev, otp: "Enter phone number first" }));
      return;
    }
    if (!phoneRegex.test(form.phone.trim())) {
      setErrors((prev) => ({
        ...prev,
        otp: "Enter a valid 10-digit number",
      }));
      return;
    }
    try {
      const response = await api.post("/v1/otp/set-otp", {
        identifier: form.phone,
      });
      console.log("OTP (dev only) => ", response.data?.data?.otp);
      setOtpSent(true);
      setOtpVerified(false);
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      clearFieldError("otp");
    } catch (error) {
      handleApiError(error, "otp");
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setErrors((prev) => ({ ...prev, otp: "Enter full 6-digit OTP" }));
      return;
    }
    try {
      const response = await api.post("/v1/otp/verify-otp", {
        identifier: form.phone,
        otp: code,
      });
      const verified = !!response.data?.data?.verified;
      setOtpVerified(verified);
      setOtpSent(!verified);
      if (!verified) {
        setErrors((prev) => ({
          ...prev,
          otp: "OTP didn't match. Try again.",
        }));
      } else {
        clearFieldError("otp");
      }
    } catch (error) {
      handleApiError(error, "otp");
    }
  };

  const submit = async () => {
    const validationErrors =
      mode === "signup" ? validateSignup() : validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      if (mode === "signup") {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: Number(form.phone),
          password: form.password,
          opt: otp.join(""),
          address: {
            country: form.country,
            state: form.state,
            city: form.city,
            pinCode: Number(form.pinCode),
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
          },
          profileImage:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        };

        const response = await api.post("/v1/user/signup", payload);

        if (!response.data?.success) {
          applyBackendResponse(response.data);
          return;
        }

        // Signup success → login modal pe le jao with success flag
        navigate("/login", {
          replace: true,
          state: { justSignedUp: true, email: form.email },
        });
      } else {
        const response = await api.post("/v1/user/login", {
          identifier: login.identifier,
          password: login.password,
        });

        if (!response.data?.success) {
          applyBackendResponse(response.data);
          return;
        }

        SetAccessToken(response?.data?.data?.AccessToken);
        const profile = await fetchUserProfile();
        setAuthUser(profile);

        if (onClose) onClose();
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      if (
        error?.response?.data &&
        typeof error.response.data.success !== "undefined"
      ) {
        applyBackendResponse(error.response.data);
      } else {
        handleApiError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = {
      1: { level: 1, label: "Weak", color: "#e53935" },
      2: { level: 2, label: "Fair", color: "#fb8c00" },
      3: { level: 3, label: "Good", color: "#43a047" },
      4: { level: 4, label: "Strong", color: "#1e88e5" },
    };
    return map[score] || { level: 1, label: "Weak", color: "#e53935" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={`${styles.modal} ${
          mode === "signup" ? styles.modalSignup : styles.modalLogin
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============= CLOSE BUTTON ============= */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* ============= HEADER ============= */}
        <div className={styles.modalHeader}>
          <div className={styles.headerIconWrap}>
            <User size={22} />
          </div>
          <h2 className={styles.headerTitle}>
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className={styles.headerSubtitle}>
            {mode === "signup"
              ? "Join us and start shopping today"
              : "Login to continue your journey"}
          </p>
        </div>

        {/* ============= SCROLLABLE BODY ============= */}
        <div className={styles.modalBody}>
          {/* Success banner */}
          {location.state?.justSignedUp && mode === "login" && (
            <div className={styles.successBanner}>
              <CheckCircle2 size={16} />
              <span>Account created! Please login.</span>
            </div>
          )}

          {/* API errors */}
          {errors.api && (
            <div className={styles.apiError}>
              <AlertCircle size={16} />
              <span>{errors.api}</span>
            </div>
          )}

          {/* ============ SIGNUP FORM ============ */}
          {mode === "signup" ? (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <div className={styles.row}>
                <Field
                  name="firstName"
                  label="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  icon={<User size={17} />}
                />
                <Field
                  name="lastName"
                  label="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  icon={<User size={17} />}
                />
              </div>

              <Field
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={17} />}
              />

              <div className={styles.phoneRow}>
                <Field
                  name="phone"
                  label="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={<Phone size={17} />}
                />
                <button
                  type="button"
                  className={`${styles.otpBtn} ${
                    otpVerified
                      ? styles.otpVerified
                      : otpSent
                      ? styles.otpSent
                      : ""
                  }`}
                  onClick={sendOtp}
                  disabled={otpVerified || (otpSent && timer > 0)}
                >
                  {otpVerified ? (
                    <>
                      <CheckCircle2 size={14} /> Verified
                    </>
                  ) : otpSent ? (
                    timer > 0 ? `${timer}s` : "Resend"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>

              {otpSent && !otpVerified && (
                <div className={styles.otpBlock}>
                  <p className={styles.otpHint}>
                    Enter 6-digit OTP sent to your phone
                  </p>
                  <div className={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-box-${index}`}
                        maxLength={1}
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={styles.otpBox}
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.verifyBtn}
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              )}
              {errors.otp && (
                <p className={styles.errorText}>{errors.otp}</p>
              )}

              <div>
                <PasswordField
                  value={form.password}
                  name="password"
                  label="Password"
                  onChange={handleChange}
                  show={showPassword}
                  setShow={setShowPassword}
                  error={errors.password}
                />
                {form.password && (
                  <div className={styles.strengthWrap}>
                    <div className={styles.strengthBars}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={styles.strengthBar}
                          style={{
                            background:
                              i <= passwordStrength.level
                                ? passwordStrength.color
                                : "#e5e5e5",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className={styles.strengthLabel}
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <PasswordField
                value={form.confirmPassword}
                name="confirmPassword"
                label="Confirm password"
                onChange={handleChange}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                error={errors.confirmPassword}
              />

              <div className={styles.sectionTitle}>Shipping Address</div>

              <div className={styles.row}>
                <Field
                  name="country"
                  label="Country"
                  value={form.country}
                  onChange={handleChange}
                  error={errors.country}
                  icon={<MapPin size={17} />}
                />
                <Field
                  name="state"
                  label="State"
                  value={form.state}
                  onChange={handleChange}
                  error={errors.state}
                  icon={<MapPin size={17} />}
                />
              </div>

              <div className={styles.row}>
                <Field
                  name="city"
                  label="City"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                  icon={<MapPin size={17} />}
                />
                <Field
                  name="pinCode"
                  label="Pin code"
                  value={form.pinCode}
                  onChange={handleChange}
                  error={errors.pinCode}
                  icon={<MapPin size={17} />}
                />
              </div>

              <Field
                name="addressLine1"
                label="Address line 1"
                value={form.addressLine1}
                onChange={handleChange}
                error={errors.addressLine1}
                icon={<Home size={17} />}
              />
              <Field
                name="addressLine2"
                label="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={handleChange}
                error={errors.addressLine2}
                icon={<Home size={17} />}
              />

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          ) : (
            /* ============ LOGIN FORM ============ */
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <Field
                name="identifier"
                label="Email or Phone"
                value={login.identifier}
                onChange={handleChange}
                error={errors.identifier}
                icon={<Mail size={17} />}
              />

              <PasswordField
                value={login.password}
                name="password"
                label="Password"
                onChange={handleChange}
                show={showPassword}
                setShow={setShowPassword}
                error={errors.password}
              />

              <div className={styles.forgotRow}>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* ============ SWITCH LINK (FIXED) ============ */}
          {/* onClick={onClose} HATA diya — warna modal turant close hota tha */}
          <div className={styles.switchRow}>
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <Link to="/login" className={styles.switchLink}>
                  Login
                </Link>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className={styles.switchLink}>
                  Sign up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// REUSABLE FIELD
// ======================================================
function Field({ name, label, value, onChange, type = "text", error, icon }) {
  return (
    <div className={styles.field}>
      <div
        className={`${styles.fieldWrapper} ${
          error ? styles.inputError : ""
        }`}
      >
        {icon && <span className={styles.fieldIcon}>{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          autoComplete="off"
        />
        <label htmlFor={name}>{label}</label>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

function PasswordField({ name, label, value, onChange, show, setShow, error }) {
  return (
    <div className={styles.field}>
      <div
        className={`${styles.fieldWrapper} ${
          error ? styles.inputError : ""
        }`}
      >
        <span className={styles.fieldIcon}>
          <Lock size={17} />
        </span>
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder=" "
          autoComplete="new-password"
        />
        <label htmlFor={name}>{label}</label>
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default SignupLogin;