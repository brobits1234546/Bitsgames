import { Link } from 'react-router-dom';
import { Gamepad2, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Gamepad2 className="h-8 w-8 text-indigo-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                BITS Games
              </span>
            </Link>
            <p className="text-slate-400 mb-4">
              A premium gaming tournament platform for friends to compete, track stats, and rise through the ranks. Create custom tournaments, chat with your team, and prove your gaming prowess.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:info@bitsgames.com" className="text-slate-400 hover:text-indigo-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-500">
            &copy; {currentYear} BITS Games. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;