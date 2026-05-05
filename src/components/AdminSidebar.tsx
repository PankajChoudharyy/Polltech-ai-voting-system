import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, BarChart3, Settings,
  Vote, LogOut, Trophy, FileText
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Candidates', href: '/admin/candidates', icon: Trophy },
  { label: 'Voters', href: '/admin/voters', icon: Users },
  { label: 'Vote Records', href: '/admin/records', icon: FileText },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Election Settings', href: '/admin/settings', icon: Settings },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAdminLoggedIn } = useAppStore();

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-foreground flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Vote className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-white text-sm block">PollTech</span>
            <span className="text-xs text-white/40">Admin Console</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Administrator</p>
            <p className="text-xs text-white/40">admin@polltech.io</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;