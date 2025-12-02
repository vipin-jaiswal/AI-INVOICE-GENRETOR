import React from "react";

const TextareaField = ({ icon: Icon, label, name, ...props }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <textarea
          id={name}
          name={name}
          {...props}
          className={`w-full h-48 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            Icon ? "pl-10" : "pl-3"
          }`}
        />
      </div>
    </div>
  );
};

export default TextareaField;
