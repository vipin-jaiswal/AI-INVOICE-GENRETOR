import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X, ChevronRight, Sparkles } from "lucide-react";
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
      // Offset calculation for fixed header
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { id: "features", label: "Features" },
    { id: "testimonials", label: "Testimonials" },
    { id: "faqs", label: "FAQ" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-gray-200/50 shadow-sm py-2"
            : "bg-transparent border-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo Section */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                <FileText className="w-5 h-5" />
                <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-300"></span>
                    </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-none tracking-tight">
                  Invoice<span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                  Beta v2.0
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleSmoothScroll(link.id)}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 ease-out"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions / Auth */}
            <div className="hidden lg:flex items-center gap-4">
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
                  onLogout={logout}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 bg-gray-100/50 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Content */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleSmoothScroll(link.id)}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          <div className="p-5 border-t border-gray-100 space-y-3 bg-gray-50/50">
            {isAuthenticated ? (
              <button
                onClick={() => {
                   navigate("/dashboard");
                   setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-xl shadow-lg shadow-gray-900/20 active:scale-95 transition-all"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;