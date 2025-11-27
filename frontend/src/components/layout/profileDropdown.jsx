import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ isOpen, onToggle, avatar, companyName, email, onLogout }) => {
  const navigate = useNavigate();
  
  const displayName = companyName && companyName.trim() ? companyName : "User";
  const displayEmail = email && email.trim() ? email : "No email";
  
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        {avatar && avatar.trim() ? (
          <img src={avatar} alt="Avatar" className="h-9 w-9 rounded-xl object-cover" />
        ) : (
          <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{displayEmail}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{displayEmail}</p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            View Profile
          </button>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

// Usage Example:
// <ProfileDropdown
//   isOpen={dropdownOpen}
