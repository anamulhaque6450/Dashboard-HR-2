import React, { useState } from 'react';
import { Search, Bell, Mail, ChevronDown } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock data for notifications and user
  const notificationCount = 3;
  const messageCount = 5;
  const user = {
    name: 'John Doe',
    role: 'Admin',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  };

  return (
    <header className={`fixed top-0 z-30 flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm transition-all duration-300 ${
      sidebarOpen 
        ? 'left-0 w-full lg:left-64 lg:w-[calc(100%-16rem)]' 
        : 'left-0 w-full lg:left-20 lg:w-[calc(100%-5rem)]'
    }`}>
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
          />
        </div>
      </div>

      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Bell className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                <div className="space-y-1">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="text-sm text-gray-900">Performance reviews are due</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="text-sm text-gray-900">New employee onboarding</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="text-sm text-gray-900">Payroll processing complete</p>
                    <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Mail className="h-6 w-6" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {messageCount}
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Profile Settings
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Account Preferences
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Help & Support
                </button>
                <hr className="my-2 border-gray-100" />
                <button className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;