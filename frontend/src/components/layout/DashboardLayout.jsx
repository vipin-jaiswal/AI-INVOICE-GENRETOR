import { useState, useEffect } from "react";    
import {
    Briefcase,
    LogOut,
    Menu,
    X,

} from "lucide-react";
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./profileDropdown";
import { NAVIGETION_MENU } from "../../utils/data";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
    const Icon = item.icon;
    return <button
        onClick={() => onClick(item.id)}
        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
    >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span className="ml-2">{item.name}</span>}
    </button>;
    

}

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            if (profileDropdownOpen) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [profileDropdownOpen]);

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
        navigate(`/${itemId}`);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const sidebarCollapsed = false;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
                isMobile
                    ? sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    : "translate-x-0"
            } ${sidebarCollapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200`}>
                
                {/* Company LOGO */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <Link className="flex items-center space-x-3" to="/dashboard">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-900 to-blue-700 rounded-lg flex justify-center items-center">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        {!sidebarCollapsed && <span className="text-gray-900 font-bold text-xl">AI Invoice</span>}
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2">
                    {NAVIGETION_MENU.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            isActive={activeNavItem === item.id}
                            onClick={() => handleNavigation(item.id)}
                            isCollapsed={sidebarCollapsed}
                        />
                    ))}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 shrink-0 text-red-600" />
                        {!sidebarCollapsed && <span className="ml-2 text-red-600 font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${
                isMobile ? "ml-0" : sidebarCollapsed ? "ml-20" : "ml-64"
            }`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center space-x-4">
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                            >
                                {sidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Welcome, {user?.name || "User"}!
                            </h1>
                            <p className="text-sm text-gray-500 hidden sm:block">
                                Here's your invoice overview
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Profile dropdown can go here */}
                        <ProfileDropdown
                            isOpen={profileDropdownOpen}
                            onToggle={(e) => {
                                e.stopPropagation();
                                setProfileDropdownOpen(!profileDropdownOpen);
                            }}
                            avatar={user?.avatar || ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            onLogout={handleLogout}
                        />
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;