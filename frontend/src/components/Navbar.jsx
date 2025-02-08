import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import NotificationSystem from './NotificationSystem';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse Mentors', path: '/browse-mentors' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {user && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/dashboard" className="text-xl font-bold text-blue-600 ml-2 md:ml-0">
              Scholars Connect
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <NotificationSystem />
              <span className="text-gray-700 hidden sm:block">{user.name}</span>
              {user.role === 'mentor' && (
                <Link
                  to="/mentor/settings"
                  className="text-gray-700 hover:text-gray-900 hidden sm:block"
                >
                  Settings
                </Link>
              )}
              <Link
                to="/browse-mentors"
                className="text-gray-700 hover:text-gray-900"
              >
                Browse Mentors
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 