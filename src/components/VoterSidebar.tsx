import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Vote, User, Shield, LogOut, CheckCircle } from 'lucide-react';
import { useAppStore } from '../lib/store';

const VoterSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAppStore();

  const navItems = [
    { label: 'Dashboard', href: '/voter/dashboard', icon: LayoutDashboard },
    { label: 'Cast Vote', href: '/voter/vote', icon: Vote },
    { label: 'My Profile', href: '/voter/profile', icon: User },
    { label: 'Security', href: '/voter/security', icon: Shield },
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-foreground flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link to="/voter/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Vote className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-white text-sm block">PollTech</span>
            <span className="text-xs text-white/40">Voter Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Voter navigation">
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
                  layoutId="voter-nav-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        {currentUser && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                {currentUser.hasVoted ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : null}
                <p className="text-xs text-white/40">{currentUser.hasVoted ? 'Voted' : 'Not voted'}</p>
              </div>
            </div>
          </div>
        )}
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

export default VoterSidebar;