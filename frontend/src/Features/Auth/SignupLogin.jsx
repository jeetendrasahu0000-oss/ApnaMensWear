import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Axios";
import styles from "./SignupLogin.module.css";
import { Eye, EyeOff, X } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { GetAccessToken, SetAccessToken } from "../../Api/TokenStore";
import { fetchUserProfile } from "../../Api/basicStore";



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

function SignupLogin({ close }) {
  const navigate = useNavigate()

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "", 
    country: "",
    state: "",
    city: "",
    pinCode: "",
    addressLine1: "",
    addressLine2: "",
  });

  const [login, setLogin] = useState({
    identifier: "",
    password: "",
  });

  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

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
      setForm({ ...form, [name]: value });
    } else {
      setLogin({ ...login, [name]: value });
    }

    clearFieldError(name);
  };

  const handleOtpChange = (index, value) => {
    
    // only allow a single digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    clearFieldError("otp");

    // auto-focus next box
    if (digit && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  // generic fallback for errors that don't follow the {success,message,error} shape
  const handleApiError = (error, fallbackField = "api") => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message || "Something went wrong. Please try again.";

    const field = error?.response?.data?.field;

    setErrors((prev) => ({
      ...prev,
      ...(field ? { [field]: message } : {}),
      [fallbackField]: message,
    }));
  };

  // parses the backend's { success, message, data, error } response shape.
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
    else if (!phoneRegex.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";

    if (!otpVerified) e.otp = "Please verify your phone/email with OTP";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";

    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";

    if (!form.country.trim()) e.country = "Country is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.city.trim()) e.city = "City is required";

    if (!form.pinCode.trim()) e.pinCode = "Pin code is required";
    else if (!/^\d{4,6}$/.test(form.pinCode)) e.pinCode = "Enter a valid pin code";

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
      setErrors((prev) => ({ ...prev, otp: "Enter your phoneNo before requesting an OTP" }));
      return;
    }
    if (!phoneRegex.test(form.phone.trim())) {
      setErrors((prev) => ({ ...prev, otp: "Please enter a valid 10-digit phone number" }));
      return;
    }

    try {
      const response = await api.post("/v1/otp/set-otp", {
        identifier:form.phone,
      });

      console.log("OTP => ", response.data?.data?.otp);
      alert(` OTP => ${response.data?.data?.otp}`)

      setOtpSent(true);
      setOtpVerified(false);
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      clearFieldError("otp");
    } 
    catch (error) {
      handleApiError(error, "otp");
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      setErrors((prev) => ({ ...prev, otp: "Enter the full 6-digit OTP" }));
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
        setErrors((prev) => ({ ...prev, otp: "That OTP didn't match. Try again." }));
      } 
      else {
        clearFieldError("otp");
      }
    } 
    catch (error) {
      handleApiError(error, "otp");
    }
  };

  const submit = async () => {
    const validationErrors = mode === "signup" ? validateSignup() : validateLogin();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      if (mode === "signup") {
        // confirmPassword is intentionally left out of the payload —
        // it only exists to confirm the user typed their password correctly
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

        alert(`${response.data.message}`)
        setMode('login')
        


      }
      else {
        const response = await api.post("/v1/user/login", {
          identifier: login.identifier,
          password: login.password,
        });

        if (!response.data?.success) {
          applyBackendResponse(response.data);
          return;
        }

        SetAccessToken(response?.data.data.AccessToken)
        
        await fetchUserProfile()

        alert(`${response.data.message}`)
        navigate('/')
        close?.()

      }

      // close?.();

    } 
    catch (error) {
      if (error?.response?.data && typeof error.response.data.success !== "undefined") {
        applyBackendResponse(error.response.data);
      } 
      else {
        handleApiError(error);
      }
    } 
    finally {
      setSubmitting(false);
    }
  };

  const otpBtnClass = [styles.otpSendBtn,otpVerified ? styles.otpBtnVerified : otpSent ? styles.otpBtnUnverified : "",]
    .filter(Boolean)
    .join(" ");




  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={close} type="button">
          <X />
        </button>

        <div className={styles.imageBox}>
          <img
            src="https://i.pinimg.com/736x/20/1e/7c/201e7cefd94fd8cf912ff4b3acefa5db.jpg"
            alt="fashion"
          />
        </div>

        <div className={styles.formSection}>
          <div className={styles.toggle}>
            <button
              type="button"
              className={mode === "login" ? styles.active : ""}
              onClick={() => {
                setMode("login");
                setErrors({});
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "signup" ? styles.active : ""}
              onClick={() => {
                setMode("signup");
                setErrors({});
              }}
            >
              Signup
            </button>
          </div>

          <h1>{mode === "signup" ? "Create account" : "Welcome back"}</h1>

          {errors.api && <p className={styles.apiError}>{errors.api}</p>}

          {mode === "signup" ? (
            <div className={styles.grid}>
              <Field
                name="firstName"
                label="First name"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />

              <Field
                name="lastName"
                label="Last name"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />

              <Field
                name="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Field
                name="phone"
                label="Phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />

              {/* OTP block spans the full width of the grid so it never
                  shares a row with an unrelated field */}
              <div className={styles.otpWrapper}>
                <button
                  type="button"
                  className={otpBtnClass}
                  onClick={sendOtp}
                  disabled={otpVerified || (otpSent && timer > 0)}
                >
                  {otpVerified ? "Verified ✓" : otpSent ? "Resend OTP" : "Send OTP"}
                </button>

                {otpSent && !otpVerified && timer > 0 && (
                  <span className={styles.otpTimer}>Resend in {timer}s</span>
                )}

                {otpSent && !otpVerified && (
                  <>
                    <div className={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-box-${index}`}
                          maxLength={1}
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={styles.otpBox}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      className={styles.otpVerifyBtn}
                      onClick={verifyOtp}
                    >
                      Verify OTP
                    </button>
                  </>
                )}

                {errors.otp && <p className={styles.errorText}>{errors.otp}</p>}
              </div>

              <PasswordField
                value={form.password}
                name="password"
                label="Password"
                onChange={handleChange}
                show={showPassword}
                setShow={setShowPassword}
                error={errors.password}
              />

              <PasswordField
                value={form.confirmPassword}
                name="confirmPassword"
                label="Confirm password"
                onChange={handleChange}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                error={errors.confirmPassword}
              />

              <Field
                name="country"
                label="Country"
                value={form.country}
                onChange={handleChange}
                error={errors.country}
              />

              <Field
                name="state"
                label="State"
                value={form.state}
                onChange={handleChange}
                error={errors.state}
              />

              <Field
                name="city"
                label="City"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
              />

              <Field
                name="pinCode"
                label="Pin Code"
                value={form.pinCode}
                onChange={handleChange}
                error={errors.pinCode}
              />

              <Field
                name="addressLine1"
                label="Address Line 1"
                value={form.addressLine1}
                onChange={handleChange}
                error={errors.addressLine1}
              />

              <Field
                name="addressLine2"
                label="Address Line 2"
                value={form.addressLine2}
                onChange={handleChange}
                error={errors.addressLine2}
              />
            </div>
          ) : (
            <>
              <Field
                name="identifier"
                label="Email or Phone"
                value={login.identifier}
                onChange={handleChange}
                error={errors.identifier}
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
            </>
          )}

          <button className={styles.submit} onClick={submit} disabled={submitting} type="button">
            {submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
          </button>

          {/* <div className={styles.social}>
            <button type="button">🌈 Continue with Google</button>
            <button type="button"><FaFacebookF /> Continue with Facebook</button>
          </div> */}

        </div>
      </div>
    </div>
  );
}

function Field({ name, label, value, onChange, type = "text", error }) {
  return (
    <div className={styles.field}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={error ? styles.inputError : ""}
      />

      <label htmlFor={name}>{label}</label>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

function PasswordField({ name, label, value, onChange, show, setShow, error }) {
  return (
    <div className={styles.password}>
      <div className={styles.field}>
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder=" "
          className={error ? styles.inputError : ""}
        />
        <label htmlFor={name}>{label}</label>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <span onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</span>
    </div>
  );
}

export default SignupLogin;

