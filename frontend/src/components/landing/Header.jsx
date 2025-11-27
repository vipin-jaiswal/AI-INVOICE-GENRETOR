import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import ProfileDropdown from "../layout/profileDropdown";
import { useAuth } from "../../context/AuthContext";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

    const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector("header");
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset - 16;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <span className="text-color-black font-extrabold">
                AI Invoice App
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleSmoothScroll("features")}
              className=" text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0  after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
            >
              Features
            </button>
            <button
              onClick={() => handleSmoothScroll("testimonials")}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0  after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
            >
              Testimonials
            </button>
            <button
              onClick={() => handleSmoothScroll("faqs")}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0  after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
            >
              FAQ
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                onLogout={() => {
                  logout();
                }}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-black hover:text-gray-900 font-medium transition-colors duration-200  hover:scale-105 hover:shadow-lg hover:bg-gray-100 px-4 py-2.5 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-2 rounded-md focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className=" lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <button
              onClick={() => handleSmoothScroll("features")}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors hover:text-gray-900"
            >
              Features
            </button>
            <button
              onClick={() => handleSmoothScroll("testimonials")}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors hover:text-gray-900"
            >
              Testimonials
            </button>
            <button
              onClick={() => handleSmoothScroll("faqs")}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors hover:text-gray-900"
            >
              FAQ
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            {isAuthenticated ? (
              <div className="px-4 py-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  GO to Dashboard
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors hover:text-gray-900 font-medium duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-left bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;