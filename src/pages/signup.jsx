import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Phone,
  MapPin,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState("initial");
  const [otp, setOtp] = useState("");
  const [selectedTribes, setSelectedTribes] = useState([]);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [securityAnswers, setSecurityAnswers] = useState({});
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    console.log(isCreator);
  }, [isCreator]);

  const [formData, setFormData] = useState({
    tribes: [],
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      console.log("Form validation failed - missing required fields");
      alert(
        "Please fill in all required fields (First Name, Email, Mobile No., Password, Confirm Password)"
      );
      return;
    }

    // Password length validation
    if (formData.password.length < 8) {
      console.log("Password validation failed - too short");
      alert("Password must be at least 8 characters long");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      console.log("Password validation failed - passwords do not match");
      alert("Password and Confirm Password must match");
      return;
    }

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password,
        role_id: isCreator ? 7 : 8, // 7 for Creator, 8 for Guest
      };
      console.log(payload);

      console.log("Sending registration payload:", payload);

      const response = await fetch("https://arunachal.upstateagro.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Registration API Response:", data);

      if (data.error && data.error.includes("already registered")) {
        alert("This email is already registered. Redirecting you to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      } else if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.clear();
      localStorage.setItem("signup_email", formData.email);
      localStorage.setItem("userName", formData.firstName);
      setCurrentStep("otp");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.message && error.message.includes("already registered")) {
        alert("This email is already registered. Redirecting you to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        alert(
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again."
        );
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("Starting OTP verification");

    const storedEmail = localStorage.getItem("signup_email");

    try {
      const payload = {
        email: storedEmail,
        code: otp,
      };

      console.log("Sending OTP verification payload:", payload);

      const response = await fetch("https://arunachal.upstateagro.com/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("OTP Verification API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      localStorage.setItem("auth_token", data.token);
      setCurrentStep("security");
    } catch (error) {
      console.error("OTP verification error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "OTP verification failed. Please try again."
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setCurrentStep("security");
  };

  const handleSecurityQuestionChange = (index, field, value) => {
    setSecurityQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        answer: field === "answer" ? value : updated[index]?.answer || "",
      };
      return updated;
    });
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth_token");
      const storedEmail = localStorage.getItem("signup_email");

      const securityAnswers = securityQuestions.map((question) => ({
        questionId: question.id,
        answer: question.answer || "",
      }));

      const hasEmptyAnswers = securityAnswers.some((qa) => !qa.answer);
      if (hasEmptyAnswers) {
        alert("Please answer all security questions");
        return;
      }

      const payload = {
        securityAnswers,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: storedEmail,
      };

      sessionStorage.setItem("newSignup", "true");
      sessionStorage.setItem("userName", formData.firstName);

      console.log("Sending security setup payload:", payload);

      const response = await fetch("https://arunachal.upstateagro.com/api/auth/setup-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Security Setup API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Security setup failed");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.firstName);
      localStorage.setItem("newSignup", "true");
      localStorage.setItem("userData", JSON.stringify(data.user));

      localStorage.removeItem("signup_email");
      localStorage.removeItem("auth_token");

      navigate("/");
    } catch (error) {
      console.error("Security setup error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Security setup failed. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTribesChange = (tribe) => {
    setSelectedTribes((prev) =>
      prev.includes(tribe) ? prev.filter((t) => t !== tribe) : [...prev, tribe]
    );
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://arunachal.upstateagro.com/api/admin/security-questions");
        const data = await response.json();
        console.log("Security Questions API Response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch security questions");
        }

        setSecurityQuestions(data.data);
      } catch (error) {
        console.error("Fetch security questions error:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to fetch security questions. Please try again."
        );
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
      </div>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center">
            {/* <img
              src="/logo_ap.png"
              alt="Logo"
              className="mx-auto w-[110px] h-[110px] mb-4"
            /> */}
            <h2 className="text-2xl font-bold text-heading mb-1">
              Create Account
            </h2>
            <p className="text-sm text-subheading mb-6">
              Join our community to explore indigenous culture.
            </p>
          </div>

          {/* Sign Up Form */}
          <form
            onSubmit={
              currentStep === "initial"
                ? handleInitialSubmit
                : currentStep === "otp"
                ? handleOtpSubmit
                : currentStep === "password"
                ? handlePasswordSubmit
                : handleSecuritySubmit
            }
            className="space-y-4"
          >
            {currentStep === "initial" && (
              <>
                {/* Become a Creator Button */}
                <div
                  onClick={() => setIsCreator(!isCreator)}
                  className={classNames(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 mb-6",
                    isCreator
                      ? "border-teal-500 bg-teal-50 "
                      : "border-gray-200  hover:border-teal-500"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={classNames(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        isCreator
                          ? "bg-teal-500"
                          : "bg-gray-100"
                      )}
                    >
                      <User
                        className={
                          isCreator
                            ? "h-6 w-6 text-white"
                            : "h-6 w-6 text-gray-500"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                      Become a Creator
                    </h3>
                    <p className="text-sm text-gray-500 ">
                      Share and contribute to our cultural heritage
                    </p>
                  </div>
                  {isCreator && (
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-teal-500" />
                    </div>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-heading mb-2"
                    >
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white "
                        placeholder="Enter First Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-heading mb-2"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white "
                        placeholder="Enter Last Name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-heading mb-2"
                    >
                      Email<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white "
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-heading mb-2"
                    >
                      Mobile No.<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white "
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-heading mb-2"
                  >
                    Create Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white "
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-heading mb-2"
                  >
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white "
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === "otp" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter the verification code sent to your email
                </p>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter OTP"
                  />
                </div>
              </div>
            )}

            {currentStep === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-heading">
                  Set Security Questions
                </h3>
                {securityQuestions.map((sq, index) => (
                  <div key={sq.id} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-2">
                        {sq.question}
                      </label>
                      <input
                        type="text"
                        value={sq.answer || ""}
                        onChange={(e) =>
                          handleSecurityQuestionChange(
                            index,
                            "answer",
                            e.target.value
                          )
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter your answer"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {currentStep === "initial"
                ? "Send OTP"
                : currentStep === "otp"
                ? "Verify OTP"
                : "Complete Registration"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 ">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign in here
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600/20 to-teal-500/20">
        <div className="h-full flex items-center justify-center p-12">
          <img
            src="/images/authRight.png"
            alt="Tribal Art"
            className="w-3/4 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
