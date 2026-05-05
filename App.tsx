import React, { Suspense } from 'react';
import '@radix-ui/themes/styles.css';
import './styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './src/pages/Home';
import About from './src/pages/About';
import HowItWorks from './src/pages/HowItWorks';
import Register from './src/pages/Register';
import Login from './src/pages/Login';
import AdminLogin from './src/pages/AdminLogin';
import NotFound from './src/pages/NotFound';

import VoterDashboard from './src/pages/voter/VoterDashboard';
import CastVote from './src/pages/voter/CastVote';
import VoterProfile from './src/pages/voter/VoterProfile';
import VoterSecurity from './src/pages/voter/VoterSecurity';

import AdminDashboard from './src/pages/admin/AdminDashboard';
import AdminCandidates from './src/pages/admin/AdminCandidates';
import AdminVoters from './src/pages/admin/AdminVoters';
import AdminRecords from './src/pages/admin/AdminRecords';
import AdminAnalytics from './src/pages/admin/AdminAnalytics';
import AdminSettings from './src/pages/admin/AdminSettings';

import { useAppStore } from './src/lib/store';

const ProtectedVoterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAppStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminLoggedIn } = useAppStore();
  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Voter Protected */}
            <Route path="/voter/dashboard" element={<ProtectedVoterRoute><VoterDashboard /></ProtectedVoterRoute>} />
            <Route path="/voter/vote" element={<ProtectedVoterRoute><CastVote /></ProtectedVoterRoute>} />
            <Route path="/voter/profile" element={<ProtectedVoterRoute><VoterProfile /></ProtectedVoterRoute>} />
            <Route path="/voter/security" element={<ProtectedVoterRoute><VoterSecurity /></ProtectedVoterRoute>} />

            {/* Admin Protected */}
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/candidates" element={<ProtectedAdminRoute><AdminCandidates /></ProtectedAdminRoute>} />
            <Route path="/admin/voters" element={<ProtectedAdminRoute><AdminVoters /></ProtectedAdminRoute>} />
            <Route path="/admin/records" element={<ProtectedAdminRoute><AdminRecords /></ProtectedAdminRoute>} />
            <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </Router>
    </Theme>
  );
};

export default App;