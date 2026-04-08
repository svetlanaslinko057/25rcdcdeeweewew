import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Package,
  Bell,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Search,
  BarChart3
} from 'lucide-react';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, requestsRes] = await Promise.all([
          axios.get(`${API}/projects/mine`, { withCredentials: true }),
          axios.get(`${API}/requests`, { withCredentials: true })
        ]);
        setProjects(projectsRes.data);
        setRequests(requestsRes.data);
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
      case 'active': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStageProgress = (stage) => {
    const stages = ['discovery', 'scope', 'design', 'development', 'qa', 'delivery', 'support'];
    const index = stages.indexOf(stage);
    return ((index + 1) / stages.length) * 100;
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'deliverables', label: 'Deliverables', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] flex" data-testid="client-dashboard">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-black/5 flex flex-col">
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A0A0A] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>D</span>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              Dev OS
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#0A0A0A] text-white' 
                    : 'text-[#0A0A0A]/60 hover:bg-black/5 hover:text-[#0A0A0A]'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate('/new-request')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-[#FF6B6B] text-white rounded-xl hover:bg-[#FF5A5A] transition-all"
              data-testid="new-request-btn"
            >
              <Plus className="w-5 h-5" strokeWidth={1.5} />
              New Request
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-black/[0.02] rounded-xl">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-xl" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-xl flex items-center justify-center text-white">
                <span className="font-medium">{user?.name?.[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-[#0A0A0A]/40 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0A0A0A]/60 hover:bg-black/5 rounded-xl transition-all mt-2"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-black/5 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
              >
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'projects' && 'My Projects'}
                {activeTab === 'requests' && 'My Requests'}
                {activeTab === 'deliverables' && 'Deliverables'}
              </h1>
              <p className="text-sm text-[#0A0A0A]/50 mt-1">
                Welcome back, {user?.name?.split(' ')[0]}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-[#0A0A0A]/60 hover:bg-black/10 transition-colors" data-testid="notifications-btn">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-[#0A0A0A]/60 hover:bg-black/10 transition-colors" data-testid="settings-btn">
                <Settings className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-3 border-black/10 border-t-[#FF6B6B] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-black/5" data-testid="stat-active-projects">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#0A0A0A]/50">Active Projects</span>
                        <div className="w-10 h-10 bg-[#FF6B6B]/10 rounded-xl flex items-center justify-center">
                          <FolderKanban className="w-5 h-5 text-[#FF6B6B]" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-black/5" data-testid="stat-pending-requests">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#0A0A0A]/50">Pending Requests</span>
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-bold">{requests.filter(r => r.status === 'pending').length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-black/5" data-testid="stat-deliverables">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#0A0A0A]/50">Pending Deliverables</span>
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-bold">0</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-black/5" data-testid="stat-completed">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#0A0A0A]/50">Completed</span>
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-bold">{projects.filter(p => p.status === 'completed').length}</div>
                    </div>
                  </div>

                  {/* Recent Projects */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                        Active Projects
                      </h2>
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className="text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors flex items-center gap-1"
                      >
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {projects.length === 0 ? (
                      <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                        <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FolderKanban className="w-8 h-8 text-[#0A0A0A]/30" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                        <p className="text-sm text-[#0A0A0A]/50 mb-6">Start by creating a new project request</p>
                        <button
                          onClick={() => navigate('/new-request')}
                          className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#0A0A0A]/80 transition-all"
                          data-testid="create-first-project-btn"
                        >
                          Create Your First Project
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.slice(0, 4).map((project, i) => (
                          <div 
                            key={project.project_id}
                            className="bg-white rounded-2xl p-6 border border-black/5 hover:border-black/10 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => navigate(`/project/${project.project_id}`)}
                            data-testid={`project-card-${i}`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold group-hover:text-[#FF6B6B] transition-colors">
                                  {project.name}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 text-xs mt-2 rounded-full border ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                              </div>
                              <ArrowUpRight className="w-5 h-5 text-[#0A0A0A]/30 group-hover:text-[#FF6B6B] transition-colors" />
                            </div>
                            <div className="mt-6">
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-[#0A0A0A]/50">Progress</span>
                                <span className="text-[#0A0A0A]/50 capitalize">{project.current_stage}</span>
                              </div>
                              <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-full transition-all"
                                  style={{ width: `${getStageProgress(project.current_stage)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Requests */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                        Recent Requests
                      </h2>
                      <button 
                        onClick={() => setActiveTab('requests')}
                        className="text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors flex items-center gap-1"
                      >
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {requests.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 text-center border border-black/5">
                        <p className="text-sm text-[#0A0A0A]/50">No requests yet</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-black/5">
                              <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Title</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requests.slice(0, 5).map((request, i) => (
                              <tr 
                                key={request.request_id}
                                className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                                data-testid={`request-row-${i}`}
                              >
                                <td className="px-6 py-4 text-sm font-medium">{request.title}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                                    {request.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#0A0A0A]/50">
                                  {new Date(request.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {projects.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                      <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderKanban className="w-8 h-8 text-[#0A0A0A]/30" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                      <p className="text-sm text-[#0A0A0A]/50 mb-6">Start by creating a new project request</p>
                      <button
                        onClick={() => navigate('/new-request')}
                        className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#0A0A0A]/80 transition-all"
                      >
                        Create Your First Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project, i) => (
                        <div 
                          key={project.project_id}
                          className="bg-white rounded-2xl p-6 border border-black/5 hover:border-black/10 hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => navigate(`/project/${project.project_id}`)}
                          data-testid={`project-list-card-${i}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold group-hover:text-[#FF6B6B] transition-colors">
                                {project.name}
                              </h3>
                              <span className={`inline-flex items-center px-3 py-1 text-xs mt-2 rounded-full border ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-[#0A0A0A]/30 group-hover:text-[#FF6B6B] transition-colors" />
                          </div>
                          <div className="mt-6">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-[#0A0A0A]/50">Stage</span>
                              <span className="text-[#0A0A0A]/50 capitalize">{project.current_stage}</span>
                            </div>
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-full transition-all"
                                style={{ width: `${getStageProgress(project.current_stage)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0A0A]/40" />
                      <input 
                        type="text"
                        placeholder="Search requests..."
                        className="bg-white border border-black/10 pl-12 pr-4 py-3 text-sm rounded-xl w-72 focus:outline-none focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10"
                      />
                    </div>
                    <button
                      onClick={() => navigate('/new-request')}
                      className="flex items-center gap-2 bg-[#0A0A0A] text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-[#0A0A0A]/80 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      New Request
                    </button>
                  </div>

                  {requests.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                      <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-[#0A0A0A]/30" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No requests yet</h3>
                      <p className="text-sm text-[#0A0A0A]/50">Submit your first project request</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-black/5">
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Budget</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Timeline</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#0A0A0A]/40 uppercase tracking-wider">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((request, i) => (
                            <tr 
                              key={request.request_id}
                              className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors cursor-pointer"
                              data-testid={`request-list-row-${i}`}
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium">{request.title}</div>
                                  <div className="text-xs text-[#0A0A0A]/50 mt-1 line-clamp-1">{request.business_idea}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#0A0A0A]/50">{request.budget_range || '-'}</td>
                              <td className="px-6 py-4 text-sm text-[#0A0A0A]/50">{request.timeline || '-'}</td>
                              <td className="px-6 py-4 text-sm text-[#0A0A0A]/50">
                                {new Date(request.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Deliverables Tab */}
              {activeTab === 'deliverables' && (
                <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                  <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-[#0A0A0A]/30" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No deliverables yet</h3>
                  <p className="text-sm text-[#0A0A0A]/50">Deliverables will appear here when your projects progress</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
