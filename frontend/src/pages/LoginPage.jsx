import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100">
      
      {/* Left Brand Showcase Section */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 relative overflow-hidden border-r border-slate-800/80">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z" />
              <circle cx="7.5" cy="14.5" r="1.5" />
              <circle cx="16.5" cy="14.5" r="1.5" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight block leading-none">DriveSelect</span>
            <span className="text-xs font-medium text-slate-400">Inventory System</span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="my-12 lg:my-0 space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">
            <span>✨ Modern Automotive Management</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Streamline your dealership inventory in real time.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access live vehicle catalog, track stock availability, process instant purchases, and manage fleet restocking seamlessly.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">✓</div>
              <span>Role-based Access Control (Admin & Standard User)</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">✓</div>
              <span>Live Inventory tracking across all locations</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">✓</div>
              <span>Automated restock alerts and purchase workflows</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} DriveSelect Inc. All rights reserved.
        </div>
      </div>

      {/* Right Authentication Form Container */}
      <div className="lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center items-center bg-slate-900">
        <div className="w-full max-w-md space-y-8">

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-xs flex items-start justify-between space-x-3 shadow-lg">
              <div className="flex items-start space-x-2">
                <span className="text-base">⚠️</span>
                <div>
                  <strong className="font-semibold block text-red-200">Authentication failed</strong>
                  <span>{formError}</span>
                </div>
              </div>
              <button
                onClick={() => setFormError(null)}
                className="text-red-400 hover:text-red-200 font-bold text-xs shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
          )}

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign in to your account</h2>
            <p className="text-xs text-slate-400">Welcome back! Sign in to access your inventory dashboard.</p>
          </div>

          <div className="p-1 bg-slate-800/80 border border-slate-700/80 rounded-xl grid grid-cols-2 text-xs font-semibold">
            <span className="py-2 text-center text-white bg-blue-600 rounded-lg shadow-sm">
              Sign In
            </span>
            <Link to="/register" className="py-2 text-center text-slate-400 hover:text-white transition-colors">
              Register
            </Link>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="james@driveselect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
              Register now
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default LoginPage;
