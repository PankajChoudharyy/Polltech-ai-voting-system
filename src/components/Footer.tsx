import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">PollTech</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              AI-powered secure voting platform ensuring every vote counts with facial recognition and blockchain integrity.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Github, label: 'GitHub' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Mail, label: 'Email' }
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white/70" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {['How It Works', 'Security', 'AI Features', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Contact', href: '/' },
                { label: 'Blog', href: '/' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © 2026 PollTech AI Voting System. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-white/40 hover:text-white/70 transition-colors duration-200">Privacy</Link>
            <Link to="/" className="text-sm text-white/40 hover:text-white/70 transition-colors duration-200">Terms</Link>
            <Link to="/" className="text-sm text-white/40 hover:text-white/70 transition-colors duration-200">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;