import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

const ClientAuthPage = () => {
  const [mode, setMode] = useState('signin'); // signin, register
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (mode === 'register' && !name.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const payload = mode === 'register' 
        ? { email: email.trim(), password, name: name.trim(), company: company.trim() || null, role: 'client' }
        : { email: email.trim(), password };
      
      const res = await axios.post(`${API}${endpoint}`, payload, { withCredentials: true });
      setUser(res.data);
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API}/auth/demo`, { role: 'client' }, { withCredentials: true });
      setUser(res.data);
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Demo access failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex" data-testid="client-auth-page">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[#0A0A0A]/50 hover:text-[#0A0A0A] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Start your project'}
            </h1>
            <p className="text-[#0A0A0A]/50">
              {mode === 'signin' 
                ? 'Sign in to access your projects' 
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex mb-8 border-b border-[#0A0A0A]/10">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                mode === 'signin' 
                  ? 'border-[#0A0A0A] text-[#0A0A0A]' 
                  : 'border-transparent text-[#0A0A0A]/40'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                mode === 'register' 
                  ? 'border-[#0A0A0A] text-[#0A0A0A]' 
                  : 'border-transparent text-[#0A0A0A]/40'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border border-[#0A0A0A]/10 p-3 focus:outline-none focus:border-[#0A0A0A]/30 transition-colors"
                    data-testid="name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company (optional)</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full border border-[#0A0A0A]/10 p-3 focus:outline-none focus:border-[#0A0A0A]/30 transition-colors"
                    data-testid="company-input"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-[#0A0A0A]/10 p-3 focus:outline-none focus:border-[#0A0A0A]/30 transition-colors"
                data-testid="email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#0A0A0A]/10 p-3 pr-10 focus:outline-none focus:border-[#0A0A0A]/30 transition-colors"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30 hover:text-[#0A0A0A]/60"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-white p-3 font-medium flex items-center justify-center gap-2 hover:bg-[#0A0A0A]/90 disabled:opacity-50 transition-all"
              data-testid="submit-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#0A0A0A]/10" />
            <span className="text-sm text-[#0A0A0A]/40">or</span>
            <div className="flex-1 h-px bg-[#0A0A0A]/10" />
          </div>

          {/* Demo Access */}
          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full border border-[#0A0A0A]/10 p-3 font-medium flex items-center justify-center gap-2 hover:bg-[#0A0A0A]/5 disabled:opacity-50 transition-all"
            data-testid="demo-btn"
          >
            <Sparkles className="w-4 h-4" />
            Enter Demo Workspace
          </button>
          <p className="text-center text-sm text-[#0A0A0A]/40 mt-3">
            Try the platform without creating an account
          </p>
        </div>
      </div>

      {/* Right Panel - Info */}
      <div className="hidden lg:flex flex-1 bg-[#0A0A0A] text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">
            Your product development,<br />
            <span className="text-white/50">structured & controlled</span>
          </h2>
          
          <div className="space-y-6 text-white/70">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <div className="font-medium text-white">Submit Your Idea</div>
                <p className="text-sm mt-1">Describe your product vision in any format</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <div className="font-medium text-white">We Structure & Execute</div>
                <p className="text-sm mt-1">Platform converts idea into production pipeline</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <div className="font-medium text-white">Review & Approve</div>
                <p className="text-sm mt-1">Get verified deliverables, ready for use</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="text-sm text-white/40 mb-2">Trusted by</div>
            <div className="text-2xl font-bold">150+ projects delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuthPage;
