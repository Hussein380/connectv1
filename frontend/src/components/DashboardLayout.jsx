import React from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Sidebar */}
            <div
                className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:inset-auto md:w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="md:pl-64">
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout; 