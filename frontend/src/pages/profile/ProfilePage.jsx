import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import Button from "../../components/ui/Button";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        {user ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center mb-8">
              <div className="bg-blue-100 p-4 rounded-full mr-6">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Name</p>
                <p className="text-2xl font-bold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>

              {user.businessName && (
                <div>
                  <p className="text-gray-600 text-sm">Business Name</p>
                  <p className="text-gray-900">{user.businessName}</p>
                </div>
              )}

              {user.phone && (
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              )}

              {user.address && (
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-gray-900">{user.address}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No user information available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 