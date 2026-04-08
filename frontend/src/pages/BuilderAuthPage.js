import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Loader2, Eye, EyeOff, Sparkles, Code, Server, Layers, Paintbrush, TestTube, Check } from 'lucide-react';

const ROLES = [
  { id: 'developer', label: 'Developer', icon: Code, description: 'Build features and products' },
  { id: 'designer', label: 'Designer', icon: Paintbrush, description: 'Create UI/UX designs' },
  { id: 'tester', label: 'Tester / QA', icon: TestTube, description: 'Validate quality and functionality' },
];

const SKILLS = {
  developer: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Go', 'TypeScript', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
  designer: ['Figma', 'Sketch', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
  tester: ['Manual Testing', 'Automation', 'Selenium', 'Cypress', 'API Testing', 'Performance Testing', 'Security Testing'],
};

const BuilderAuthPage = () => {
  const [mode, setMode] = useState('signin'); // signin, register
  const [step, setStep] = useState(1); // 1: form, 2: role, 3: skills
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: email.trim(),
        password
      }, { withCredentials: true });
      
      setUser(res.data);
      const route = res.data.role === 'tester' ? '/tester/dashboard' : '/developer/dashboard';
      navigate(route);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStep1 = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) return;
    setStep(2);
  };

  const handleRegisterStep2 = () => {
    if (!selectedRole) return;
    setStep(3);
  };

  const handleRegisterComplete = async () => {
    setLoading(true);
    setError('');
    
    const actualRole = selectedRole === 'tester' ? 'tester' : 'developer';
    
    try {
      const res = await axios.post(`${API}/auth/register`, {
        email: email.trim(),
        password,
        name: name.trim(),
        role: actualRole,
        skills: selectedSkills,
        specialization: selectedRole
      }, { withCredentials: true });
      
      setUser(res.data);
      const route = actualRole === 'tester' ? '/tester/dashboard' : '/developer/dashboard';
      navigate(route);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleDemoAccess = async (role = 'developer') => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API}/auth/demo`, { role }, { withCredentials: true });
      setUser(res.data);
      const route = role === 'tester' ? '/tester/dashboard' : '/developer/dashboard';
      navigate(route);
    } catch (err) {
      setError(err.response?.data?.detail || 'Demo access failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex" data-testid="builder-auth-page">
      {/* Left Panel - Info */}
      <div className="hidden lg:flex flex-1 bg-white text-[#0A0A0A] items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">
            Join the platform,<br />
            <span className="text-[#0A0A0A]/50">build great products</span>
          </h2>
          
          <div className="space-y-6">
            <div className="p-4 border border-[#0A0A0A]/10">
              <div className="font-medium mb-2">Structured Work</div>
              <p className="text-sm text-[#0A0A0A]/60">Clear tasks, defined scope, no ambiguity</p>
            </div>
            
            <div className="p-4 border border-[#0A0A0A]/10">
              <div className="font-medium mb-2">Fair Distribution</div>
              <p className="text-sm text-[#0A0A0A]/60">Assignment based on skills and capacity</p>
            </div>
            
            <div className="p-4 border border-[#0A0A0A]/10">
              <div className="font-medium mb-2">Quality Focus</div>
              <p className="text-sm text-[#0A0A0A]/60">Review-driven, validation-passed deliveries</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#0A0A0A]/10">
            <div className="text-sm text-[#0A0A0A]/40 mb-2">Platform stats</div>
            <div className="flex gap-8">
              <div>
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm text-[#0A0A0A]/50">Active builders</div>
              </div>
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-[#0A0A0A]/50">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back */}
          <button 
            onClick={() => step > 1 && mode === 'register' ? setStep(step - 1) : navigate('/')}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 && mode === 'register' ? 'Back' : 'Back to home'}
          </button>

          {/* Sign In Mode */}
          {mode === 'signin' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
                <p className="text-white/50">Sign in to your builder account</p>
              </div>

              {/* Mode Tabs */}
              <div className="flex mb-8 border-b border-white/10">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    mode === 'signin' ? 'border-white text-white' : 'border-transparent text-white/40'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('register'); setStep(1); }}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    mode === 'register' ? 'border-white text-white' : 'border-transparent text-white/40'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    data-testid="email-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 p-3 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-[#0A0A0A] p-3 font-medium flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 transition-all"
                  data-testid="signin-btn"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-sm text-white/40">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={() => handleDemoAccess('developer')}
                disabled={loading}
                className="w-full border border-white/20 p-3 font-medium flex items-center justify-center gap-2 hover:bg-white/5 disabled:opacity-50 transition-all"
                data-testid="demo-btn"
              >
                <Sparkles className="w-4 h-4" />
                Enter Demo Workspace
              </button>
            </>
          )}

          {/* Register Mode - Step 1 */}
          {mode === 'register' && step === 1 && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Join the platform</h1>
                <p className="text-white/50">Create your builder account</p>
              </div>

              <div className="flex mb-8 border-b border-white/10">
                <button
                  onClick={() => setMode('signin')}
                  className="flex-1 pb-3 text-sm font-medium border-b-2 border-transparent text-white/40"
                >
                  Sign In
                </button>
                <button className="flex-1 pb-3 text-sm font-medium border-b-2 border-white text-white">
                  Register
                </button>
              </div>

              <form onSubmit={handleRegisterStep1} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-white text-[#0A0A0A] p-3 font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* Register Mode - Step 2: Role */}
          {mode === 'register' && step === 2 && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">What do you do?</h1>
                <p className="text-white/50">Select your primary role</p>
              </div>

              <div className="space-y-3 mb-6">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 border text-left transition-all flex items-center gap-4 ${
                      selectedRole === role.id 
                        ? 'border-white bg-white/10' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      selectedRole === role.id ? 'bg-white text-black' : 'bg-white/10'
                    }`}>
                      <role.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-white/50">{role.description}</div>
                    </div>
                    {selectedRole === role.id && (
                      <Check className="w-5 h-5 text-white" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRegisterStep2}
                disabled={!selectedRole}
                className="w-full bg-white text-[#0A0A0A] p-3 font-medium flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Register Mode - Step 3: Skills */}
          {mode === 'register' && step === 3 && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Your skills</h1>
                <p className="text-white/50">Select your technical skills</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {SKILLS[selectedRole]?.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 text-sm border transition-all ${
                      selectedSkills.includes(skill)
                        ? 'border-white bg-white text-black'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}

              <button
                onClick={handleRegisterComplete}
                disabled={loading}
                className="w-full bg-white text-[#0A0A0A] p-3 font-medium flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Registration <ArrowRight className="w-4 h-4" /></>}
              </button>

              <button
                onClick={handleRegisterComplete}
                className="w-full mt-3 text-white/50 hover:text-white text-sm"
              >
                Skip for now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderAuthPage;
