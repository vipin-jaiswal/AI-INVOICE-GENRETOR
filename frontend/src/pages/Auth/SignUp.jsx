import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User

} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail, validatePassword } from "../../utils/helper";

const SignUp = () => {

    const {login} = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    //validation functions and handlers would go here
     const validateName = (name) => {
      if (!name.trim()) 
        return "Name is required";
      if(name.length < 2) 
        return "Name must be at least 2 characters long";
      if(name.length > 50) 
        return "Name cannot exceed 50 characters";
      return "";
     }

     const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword ) 
          return "please confirm your password";
        if (confirmPassword !== formData.password) 
          return "Passwords do not match";
        return "";
     }
     

     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        // real time validation
        if (touched[name]) {
          const newFieldErrors = { ...fieldErrors };
          if (name === "name") {
            newFieldErrors.name = validateName(value);
          } else if (name === "email") {
            newFieldErrors.email = validateEmail(value);
          } else if (name === "password") {
            newFieldErrors.password = validatePassword(value);
            if (touched.confirmPassword) {
              newFieldErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, value);
            }
          }
          else if (name === "confirmPassword") { 
            newFieldErrors.confirmPassword = validateConfirmPassword(value, formData.password);
          }

          setFieldErrors(newFieldErrors);
        } 
        if (error) setError("");
     };

    const handleBlur = (e) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      // Validate on blur
      const newFieldErrors = { ...fieldErrors };
      if (name === "name") {
        newFieldErrors.name = validateName(formData.name);
      } else if (name === "email") {
        newFieldErrors.email = validateEmail(formData.email);
      } else if (name === "password") {
        newFieldErrors.password = validatePassword(formData.password);
      } else if (name === "confirmPassword") {
        newFieldErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
      }
      setFieldErrors(newFieldErrors);
    }

    const isFormValid = () => {
      const nameError = validateName(formData.name);
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
      return (
      !nameError && 
      !emailError && 
      !passwordError && 
      !confirmPasswordError &&
      formData.name && 
      formData.email &&
      formData.password && 
      formData.confirmPassword
      )
      
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      const nameError = validateName(formData.name);
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
      
      if (nameError || emailError || passwordError || confirmPasswordError) {
        setFieldErrors({
          name: nameError,
          email: emailError,
          password: passwordError,
          confirmPassword: confirmPasswordError
        });
        setTouched({
          name: true,
          email: true,
          password: true,
          confirmPassword: true
        });
        return;
      }
      
      setIsLoading(true);
      setError("");
      setSuccess("");
      
      try {
        const response = await axiosInstance.post( 
          API_PATHS.AUTH.REGISTER,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            termsAccepted: true
          }
        );
        
        console.log("Full signup response:", response.data);

        if (response.status === 201 && response.data) {
          let { token } = response.data;
          let user = response.data.user;
          
          // If backend doesn't return user object, construct it from form data
          if (!user) {
            user = {
              id: response.data.id || response.data.userId || Date.now(),
              name: formData.name,
              email: formData.email,
              avatar: response.data.avatar || ""
            };
          } else if (!user.name) {
            // If user exists but no name, add it from form data
            user.name = formData.name;
          }
          
          console.log("Signup - User object:", user);
          
          if (token && user && user.name) {
            login(user, token);
            
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: ""
            });
            setTouched({
              name: false,
              email: false,
              password: false,
              confirmPassword: false
            });
            
            setSuccess("Registration successful! Redirecting...");
            
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
          } else {
            setError("Invalid response: Missing required data");
          }
        } 
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {  
          setError("Registration failed. Please try again.");
        }
        console.error("API error ", error.response || error);
      } finally {
        setIsLoading(false);
      }
    };
      


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-linear-to-tr from-blue-500 to-purple-600 animate-pulse text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join Invoice Generator to manage your business
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.name && touched.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email && touched.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.password && touched.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-3 mt-6">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
              >
                Terms of Service
              </button>
              {" "}and{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="group w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-black font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;