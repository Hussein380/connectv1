import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Pages that should have a clean layout (no navbar/sidebar)
  const cleanLayoutPaths = ['/', '/login', '/register'];
  const isCleanLayout = cleanLayoutPaths.includes(location.pathname);

  if (isCleanLayout) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(prev => !prev)} />

      <div className="flex pt-16">
        {/* Sidebar - Hidden on mobile by default */}
        <div className={`
          fixed inset-y-0 left-0 transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          transition duration-200 ease-in-out
          z-30 md:z-0
          top-16
        `}>
          {user && <Sidebar />}
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={`
          flex-1 
          ${user ? 'md:ml-64' : ''} 
          min-h-screen
          transition-all duration-200
        `}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 