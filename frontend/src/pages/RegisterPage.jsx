import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password });
      navigate('/login');
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100">
      
      {/* Left Branding & Hero Section (DriveSelect UI) */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border-r border-slate-800/80 relative overflow-hidden">
        
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z" />
                <circle cx="7.5" cy="14.5" r="1.5" />
                <circle cx="16.5" cy="14.5" r="1.5" />
              </svg>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">DriveSelect</span>
          </div>

          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Join 240+ registered dealerships</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Create your account & manage inventory <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">seamlessly.</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get started in minutes with complete fleet search, real-time inventory tracking, and purchase control.
            </p>
          </div>

          <div className="mt-10 space-y-4 max-w-md">
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">✓</div>
              <span>Instant dealership fleet search & filtering</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">✓</div>
              <span>Real-time stock reservation & purchasing</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">✓</div>
              <span>Role-based authorization & administrative options</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} DriveSelect Inc. All rights reserved.
        </div>
      </div>

      {/* Right Registration Form Container */}
      <div className="lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center items-center bg-slate-900">
        <div className="w-full max-w-md space-y-8">

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-xs flex items-start justify-between space-x-3 shadow-lg">
              <div className="flex items-start space-x-2">
                <span className="text-base">⚠️</span>
                <div>
                  <strong className="font-semibold block text-red-200">Registration failed</strong>
                  <span>{formError}</span>
                </div>
              </div>
              <button onClick={() => setFormError('')} className="text-red-400 hover:text-red-200 text-sm">✕</button>
            </div>
          )}

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create a new account</h2>
            <p className="text-xs text-slate-400">Sign up for dealership access to explore inventory.</p>
          </div>

          <div className="p-1 bg-slate-800/80 border border-slate-700/80 rounded-xl grid grid-cols-2 text-xs font-semibold">
            <Link to="/login" className="py-2 text-center text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <span className="py-2 text-center text-white bg-blue-600 rounded-lg shadow-sm">
              Register
            </span>
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
                placeholder="newuser@driveselect.com"
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
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">Password must be at least 6 characters long</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              Register
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}

export default RegisterPage;
