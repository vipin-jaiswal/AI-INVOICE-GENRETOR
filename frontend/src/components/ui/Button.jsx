import {Loader} from "lucide-react";

const Button = ({ 
    variant="primary",
    size="medium",
    isLoading=false,
    children,
    icon: Icon,
    ...props
 }) => {
const baseClass = "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors  disabled:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"; 
const variantClasses={
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-300 border border-gray-300 focus:ring-gray-400",
    ghost: "bg-transparent text-red-800 hover:bg-gray-100 focus:ring-gray-400",
};
const sizeClasses={
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-5 py-3 text-lg",
};
    return (
        <button
            className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Loader className="animate-spin mr-2 h-5 w-5" />
            ) : (
                <>
                {Icon && <Icon className="mr-2 h-5 w-5" />}
            {children}
            </>
    )}
        </button>
    );
};

export default Button;