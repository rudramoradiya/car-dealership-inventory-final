import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Navbar() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide top navigation bar on auth pages (Login & Register)
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (email) => {
    if (!email) return 'DS';
    const namePart = email.split('@')[0];
    return namePart.substring(0, 2).toUpperCase();
  };

  const getNameFromEmail = (email) => {
    if (!email) return 'User';
    const username = email.split('@')[0];
    if (username.toLowerCase() === 'user' || username.toLowerCase() === 'admin') {
      return email;
    }
    return username
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left Brand Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z" />
                  <circle cx="7.5" cy="14.5" r="1.5" />
                  <circle cx="16.5" cy="14.5" r="1.5" />
                </svg>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-black text-white tracking-tight">DriveSelect</span>
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">Inventory</span>
                <span className="sr-only">Car Dealership Inventory</span>
              </div>
            </Link>
          </div>

          {/* Right User Navigation & Controls */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 sm:space-x-4">
                
                {/* User Info Avatar & Extracted Name Display */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {getInitials(user?.email)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[130px]" title={user?.email}>
                      {getNameFromEmail(user?.email)}
                    </span>
                    {isAdmin ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        User
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all shadow-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
