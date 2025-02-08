import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorshipAPI } from '../services/api';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  UserCog,
  Settings,
  Users,
  Bell,
  Briefcase,
  Send
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = React.useState(0);

  const mentorLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      to: '/opportunities/manage',
      label: 'My Opportunities',
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      to: '/opportunities/create',
      label: 'Create Opportunity',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      to: '/mentorship/requests',
      label: 'Mentorship Requests',
      icon: <MessageSquare className="h-5 w-5" />,
      badge: pendingCount
    },
    {
      to: '/mentor/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const menteeLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      to: '/opportunities',
      label: 'Browse Opportunities',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      to: '/mentorship/my-requests',
      label: 'My Requests',
      icon: <Send className="h-5 w-5" />
    }
  ];

  const links = user?.role === 'mentor' ? mentorLinks : menteeLinks;

  React.useEffect(() => {
    if (user?.role === 'mentor') {
      fetchPendingCount();
    }
  }, [user]);

  const fetchPendingCount = async () => {
    try {
      const requests = await mentorshipAPI.getRequests();
      const count = requests.filter(r => r.status === 'pending').length;
      setPendingCount(count);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  return (
    <div className="w-64 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      <div className="p-6">
        <div className="space-y-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${location.pathname === link.to
                  ? 'bg-white/10 text-white'
                  : 'text-blue-100 hover:bg-white/5'}
              `}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 