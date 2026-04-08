import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  LayoutDashboard,
  Shield,
  CheckCircle,
  XCircle,
  LogOut,
  AlertTriangle,
  Eye,
  Bug,
  Smartphone,
  Monitor,
  ChevronRight,
  FileSearch
} from 'lucide-react';

const TesterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [validationTasks, setValidationTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/tester/validation-tasks`, { withCredentials: true });
        setValidationTasks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'in_progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'passed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'queue', label: 'Validation Queue', icon: FileSearch },
    { id: 'issues', label: 'Issues', icon: Bug },
    { id: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  // Mock data for demo
  const mockValidationTasks = validationTasks.length > 0 ? validationTasks : [
    {
      validation_id: 'val_demo1',
      unit_title: 'User Authentication Flow',
      project_name: 'E-Commerce Platform',
      status: 'in_progress',
      issues: [],
      checklist: {
        visual: false,
        responsive: false,
        flow: true,
        ux: false
      }
    },
    {
      validation_id: 'val_demo2',
      unit_title: 'Dashboard Analytics',
      project_name: 'Analytics Dashboard',
      status: 'pending',
      issues: [],
      checklist: {
        visual: false,
        responsive: false,
        flow: false,
        ux: false
      }
    },
    {
      validation_id: 'val_demo3',
      unit_title: 'Payment Integration',
      project_name: 'E-Commerce Platform',
      status: 'passed',
      issues: [],
      checklist: {
        visual: true,
        responsive: true,
        flow: true,
        ux: true
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex" data-testid="tester-dashboard">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight block" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                QA Panel
              </span>
              <span className="text-xs text-white/40">Tester Workspace</span>
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
                data-testid={`tester-nav-${item.id}`}
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
              <div className="text-xs text-emerald-400">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors mt-2"
            data-testid="tester-logout-btn"
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
                {activeTab === 'overview' && 'Tester Dashboard'}
                {activeTab === 'queue' && 'Validation Queue'}
                {activeTab === 'issues' && 'Reported Issues'}
                {activeTab === 'completed' && 'Completed Validations'}
              </h1>
              <p className="text-sm text-white/60 mt-1">
                Quality Assurance & Validation
              </p>
            </div>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="border border-white/10 p-6" data-testid="tester-stat-queue">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">In Queue</span>
                        <FileSearch className="w-4 h-4 text-yellow-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockValidationTasks.filter(t => t.status === 'pending').length}
                      </div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="tester-stat-progress">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">In Progress</span>
                        <Eye className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockValidationTasks.filter(t => t.status === 'in_progress').length}
                      </div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="tester-stat-passed">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Passed</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockValidationTasks.filter(t => t.status === 'passed').length}
                      </div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="tester-stat-failed">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Failed</span>
                        <XCircle className="w-4 h-4 text-red-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">
                        {mockValidationTasks.filter(t => t.status === 'failed').length}
                      </div>
                    </div>
                  </div>

                  {/* Current Validations */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                        Active Validations
                      </h2>
                      <button 
                        onClick={() => setActiveTab('queue')}
                        className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                      >
                        View queue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {mockValidationTasks.filter(t => t.status === 'in_progress' || t.status === 'pending').map((task, i) => (
                        <div 
                          key={task.validation_id}
                          className="border border-white/10 p-6 hover:border-white/20 transition-colors"
                          data-testid={`validation-task-${i}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{task.unit_title}</h3>
                              <p className="text-sm text-white/60 mt-1">{task.project_name}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Validation Checklist */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className={`p-4 border ${task.checklist?.visual ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Monitor className="w-4 h-4 text-white/40" />
                                <span className="text-xs text-white/60">Visual</span>
                              </div>
                              {task.checklist?.visual ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <div className="w-5 h-5 border border-white/20" />
                              )}
                            </div>
                            <div className={`p-4 border ${task.checklist?.responsive ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Smartphone className="w-4 h-4 text-white/40" />
                                <span className="text-xs text-white/60">Responsive</span>
                              </div>
                              {task.checklist?.responsive ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <div className="w-5 h-5 border border-white/20" />
                              )}
                            </div>
                            <div className={`p-4 border ${task.checklist?.flow ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-white/40" />
                                <span className="text-xs text-white/60">Flow</span>
                              </div>
                              {task.checklist?.flow ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <div className="w-5 h-5 border border-white/20" />
                              )}
                            </div>
                            <div className={`p-4 border ${task.checklist?.ux ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-white/40" />
                                <span className="text-xs text-white/60">UX</span>
                              </div>
                              {task.checklist?.ux ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <div className="w-5 h-5 border border-white/20" />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-6">
                            <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                              Pass Validation
                            </button>
                            <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
                              Report Issue
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Queue Tab */}
              {activeTab === 'queue' && (
                <div className="space-y-6">
                  {mockValidationTasks.filter(t => t.status === 'pending').length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <FileSearch className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Queue is empty</h3>
                      <p className="text-sm text-white/60">No validations waiting in queue</p>
                    </div>
                  ) : (
                    <div className="border border-white/10">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockValidationTasks.filter(t => t.status === 'pending').map((task, i) => (
                            <tr 
                              key={task.validation_id}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              data-testid={`queue-row-${i}`}
                            >
                              <td className="px-6 py-4 text-sm font-medium">{task.unit_title}</td>
                              <td className="px-6 py-4 text-sm text-white/60">{task.project_name}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button className="text-emerald-400 hover:text-white transition-colors text-sm">
                                  Start Validation
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Issues Tab */}
              {activeTab === 'issues' && (
                <div className="border border-white/10 p-12 text-center">
                  <Bug className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reported issues</h3>
                  <p className="text-sm text-white/60">Issues you report during validation will appear here</p>
                </div>
              )}

              {/* Completed Tab */}
              {activeTab === 'completed' && (
                <div className="space-y-6">
                  {mockValidationTasks.filter(t => t.status === 'passed' || t.status === 'failed').length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <CheckCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No completed validations</h3>
                      <p className="text-sm text-white/60">Your completed validations will appear here</p>
                    </div>
                  ) : (
                    <div className="border border-white/10">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockValidationTasks.filter(t => t.status === 'passed' || t.status === 'failed').map((task, i) => (
                            <tr 
                              key={task.validation_id}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              data-testid={`completed-row-${i}`}
                            >
                              <td className="px-6 py-4 text-sm font-medium">{task.unit_title}</td>
                              <td className="px-6 py-4 text-sm text-white/60">{task.project_name}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default TesterDashboard;
