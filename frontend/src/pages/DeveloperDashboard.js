import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  LayoutDashboard,
  Code,
  Clock,
  CheckCircle,
  LogOut,
  Play,
  Pause,
  Send,
  FileCode,
  Timer,
  ArrowUpRight,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [assignments, setAssignments] = useState([]);
  const [workUnits, setWorkUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, unitsRes] = await Promise.all([
          axios.get(`${API}/developer/assignments`, { withCredentials: true }),
          axios.get(`${API}/developer/work-units`, { withCredentials: true })
        ]);
        setAssignments(assignmentsRes.data);
        setWorkUnits(unitsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'submitted': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'work-units', label: 'Work Units', icon: Code },
    { id: 'time-logs', label: 'Time Logs', icon: Clock },
    { id: 'submissions', label: 'Submissions', icon: Send }
  ];

  // Mock data for demo
  const mockWorkUnits = workUnits.length > 0 ? workUnits : [
    {
      unit_id: 'unit_demo1',
      title: 'Implement User Authentication',
      description: 'Build login/register flow with OAuth integration',
      unit_type: 'task',
      estimated_hours: 8,
      actual_hours: 3,
      status: 'in_progress',
      project_name: 'E-Commerce Platform'
    },
    {
      unit_id: 'unit_demo2',
      title: 'Design Dashboard UI',
      description: 'Create responsive admin dashboard with charts',
      unit_type: 'design',
      estimated_hours: 12,
      actual_hours: 0,
      status: 'assigned',
      project_name: 'Analytics Dashboard'
    },
    {
      unit_id: 'unit_demo3',
      title: 'API Integration - Payment Gateway',
      description: 'Integrate Stripe payment processing',
      unit_type: 'integration',
      estimated_hours: 6,
      actual_hours: 6,
      status: 'submitted',
      project_name: 'E-Commerce Platform'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex" data-testid="developer-dashboard">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF3B30] flex items-center justify-center">
              <Code className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight block" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                Dev Panel
              </span>
              <span className="text-xs text-white/40">Developer Workspace</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeTab === item.id 
                    ? 'bg-white text-black' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`dev-nav-${item.id}`}
              >
                <item.icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                <span className="text-sm font-medium">{user?.name?.[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-[#FF3B30]">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors mt-2"
            data-testid="dev-logout-btn"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-white/10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
              >
                {activeTab === 'overview' && 'Developer Dashboard'}
                {activeTab === 'work-units' && 'Work Units'}
                {activeTab === 'time-logs' && 'Time Logs'}
                {activeTab === 'submissions' && 'Submissions'}
              </h1>
              <p className="text-sm text-white/60 mt-1">
                Level: {user?.level || 'Junior'} • Rating: {user?.rating || 5.0}/5
              </p>
            </div>
            
            {/* Active Timer */}
            {activeTimer && (
              <div className="flex items-center gap-4 bg-[#FF3B30]/10 border border-[#FF3B30]/30 px-4 py-2">
                <Timer className="w-4 h-4 text-[#FF3B30]" />
                <span className="font-mono text-lg">{formatTime(timerSeconds)}</span>
                <button 
                  onClick={() => setActiveTimer(null)}
                  className="text-[#FF3B30] hover:text-white transition-colors"
                >
                  <Pause className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF3B30] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="border border-white/10 p-6" data-testid="dev-stat-active">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Active Tasks</span>
                        <Code className="w-4 h-4 text-[#FF3B30]" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockWorkUnits.filter(u => u.status === 'in_progress' || u.status === 'assigned').length}
                      </div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="dev-stat-submitted">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Pending Review</span>
                        <Send className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockWorkUnits.filter(u => u.status === 'submitted').length}
                      </div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="dev-stat-hours">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Hours This Week</span>
                        <Clock className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockWorkUnits.reduce((sum, u) => sum + u.actual_hours, 0)}
                      </div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="dev-stat-completed">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Completed</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">{user?.completed_tasks || 0}</div>
                    </div>
                  </div>

                  {/* Current Work */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                        Current Work
                      </h2>
                      <button 
                        onClick={() => setActiveTab('work-units')}
                        className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                      >
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {mockWorkUnits.filter(u => u.status !== 'completed').slice(0, 3).map((unit, i) => (
                        <div 
                          key={unit.unit_id}
                          className="border border-white/10 p-6 hover:border-white/20 transition-colors"
                          data-testid={`dev-work-unit-${i}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FileCode className="w-4 h-4 text-white/40" />
                                <span className="text-xs text-white/40">{unit.project_name || 'Project'}</span>
                              </div>
                              <h3 className="font-semibold mb-2">{unit.title}</h3>
                              <p className="text-sm text-white/60 line-clamp-1">{unit.description}</p>
                              <div className="flex items-center gap-4 mt-4">
                                <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(unit.status)}`}>
                                  {unit.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-white/40">
                                  {unit.actual_hours}/{unit.estimated_hours}h
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {unit.status === 'in_progress' ? (
                                <button
                                  onClick={() => {
                                    if (activeTimer === unit.unit_id) {
                                      setActiveTimer(null);
                                    } else {
                                      setActiveTimer(unit.unit_id);
                                      setTimerSeconds(0);
                                    }
                                  }}
                                  className={`p-2 transition-colors ${
                                    activeTimer === unit.unit_id 
                                      ? 'bg-[#FF3B30] text-white' 
                                      : 'bg-white/10 text-white hover:bg-white/20'
                                  }`}
                                  data-testid={`timer-btn-${i}`}
                                >
                                  {activeTimer === unit.unit_id ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </button>
                              ) : unit.status === 'assigned' ? (
                                <button
                                  className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                                  data-testid={`start-btn-${i}`}
                                >
                                  Start
                                </button>
                              ) : (
                                <span className="text-xs text-white/40">Awaiting review</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="h-1 bg-white/10 overflow-hidden">
                              <div 
                                className="h-full bg-[#FF3B30] transition-all"
                                style={{ width: `${(unit.actual_hours / unit.estimated_hours) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Work Units Tab */}
              {activeTab === 'work-units' && (
                <div className="space-y-6">
                  <div className="border border-white/10">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Task</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Hours</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockWorkUnits.map((unit, i) => (
                          <tr 
                            key={unit.unit_id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            data-testid={`work-unit-row-${i}`}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium">{unit.title}</div>
                                <div className="text-xs text-white/60 mt-1">{unit.project_name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs px-2 py-1 bg-white/5 text-white/60 capitalize">
                                {unit.unit_type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(unit.status)}`}>
                                {unit.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-white/60">
                              {unit.actual_hours}/{unit.estimated_hours}h
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-[#FF3B30] hover:text-white transition-colors text-sm">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Time Logs Tab */}
              {activeTab === 'time-logs' && (
                <div className="border border-white/10 p-12 text-center">
                  <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Time Tracking</h3>
                  <p className="text-sm text-white/60">Start a timer on any work unit to log your hours</p>
                </div>
              )}

              {/* Submissions Tab */}
              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  {mockWorkUnits.filter(u => u.status === 'submitted').length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <Send className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending submissions</h3>
                      <p className="text-sm text-white/60">Complete and submit your work units for review</p>
                    </div>
                  ) : (
                    mockWorkUnits.filter(u => u.status === 'submitted').map((unit, i) => (
                      <div 
                        key={unit.unit_id}
                        className="border border-white/10 p-6"
                        data-testid={`submission-${i}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{unit.title}</h3>
                            <p className="text-sm text-white/60 mt-1">Submitted for review</p>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 text-xs border border-purple-400/30 text-purple-400 bg-purple-400/10">
                            Pending Review
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
