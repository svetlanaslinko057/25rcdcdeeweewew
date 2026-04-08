import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Code,
  Shield,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  ChevronDown,
  Search,
  BarChart3,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  UserCog,
  GitBranch,
  Package
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [workUnits, setWorkUnits] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes, requestsRes, unitsRes, subsRes] = await Promise.all([
          axios.get(`${API}/admin/users`, { withCredentials: true }),
          axios.get(`${API}/admin/projects`, { withCredentials: true }),
          axios.get(`${API}/admin/requests`, { withCredentials: true }),
          axios.get(`${API}/admin/work-units`, { withCredentials: true }),
          axios.get(`${API}/admin/submissions`, { withCredentials: true })
        ]);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);
        setRequests(requestsRes.data);
        setWorkUnits(unitsRes.data);
        setSubmissions(subsRes.data);
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
      case 'active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'approved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'developer': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'tester': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'work-board', label: 'Work Board', icon: GitBranch },
    { id: 'review-queue', label: 'Review Queue', icon: Eye },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'developers', label: 'Developers', icon: Code },
    { id: 'testers', label: 'Testers', icon: Shield }
  ];

  const developers = users.filter(u => u.role === 'developer');
  const testers = users.filter(u => u.role === 'tester');
  const clients = users.filter(u => u.role === 'client');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight block" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                Admin Panel
              </span>
              <span className="text-xs text-white/40">Control Center</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
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
                data-testid={`admin-nav-${item.id}`}
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
              <div className="text-xs text-purple-400">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors mt-2"
            data-testid="admin-logout-btn"
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
                {activeTab === 'overview' && 'Admin Dashboard'}
                {activeTab === 'requests' && 'Client Requests'}
                {activeTab === 'projects' && 'All Projects'}
                {activeTab === 'work-board' && 'Work Board'}
                {activeTab === 'review-queue' && 'Review Queue'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'developers' && 'Developer Pool'}
                {activeTab === 'testers' && 'Tester Pool'}
              </h1>
              <p className="text-sm text-white/60 mt-1">
                Platform Control Center
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-white/60 hover:text-white transition-colors" data-testid="admin-settings-btn">
                <Settings className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="border border-white/10 p-6" data-testid="admin-stat-projects">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Active Projects</span>
                        <FolderKanban className="w-4 h-4 text-[#FF3B30]" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="admin-stat-requests">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Pending Requests</span>
                        <FileText className="w-4 h-4 text-yellow-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">{requests.filter(r => r.status === 'pending').length}</div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="admin-stat-developers">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Developers</span>
                        <Code className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">{developers.length}</div>
                    </div>
                    <div className="border border-white/10 p-6" data-testid="admin-stat-testers">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">Testers</span>
                        <Shield className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                      </div>
                      <div className="text-3xl font-bold">{testers.length}</div>
                    </div>
                  </div>

                  {/* Production Pipeline */}
                  <div>
                    <h2 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                      Production Pipeline
                    </h2>
                    <div className="grid grid-cols-6 gap-px bg-white/10">
                      {['Requests', 'Scoping', 'Development', 'Review', 'Validation', 'Delivery'].map((stage, i) => (
                        <div key={stage} className="bg-[#0A0A0A] p-6 text-center">
                          <div className="text-3xl font-bold mb-2">
                            {i === 0 && requests.filter(r => r.status === 'pending').length}
                            {i === 1 && projects.filter(p => p.current_stage === 'scope').length}
                            {i === 2 && workUnits.filter(u => u.status === 'in_progress').length}
                            {i === 3 && submissions.length}
                            {i === 4 && workUnits.filter(u => u.status === 'validation').length}
                            {i === 5 && projects.filter(p => p.current_stage === 'delivery').length}
                          </div>
                          <div className="text-xs text-white/60">{stage}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Requests */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                          Recent Requests
                        </h2>
                        <button 
                          onClick={() => setActiveTab('requests')}
                          className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                        >
                          View all <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      {requests.length === 0 ? (
                        <div className="border border-white/10 p-8 text-center">
                          <p className="text-sm text-white/60">No requests yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {requests.slice(0, 5).map((req, i) => (
                            <div 
                              key={req.request_id}
                              className="border border-white/10 p-4 hover:border-white/20 transition-colors cursor-pointer"
                              data-testid={`admin-request-${i}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{req.title}</div>
                                  <div className="text-xs text-white/60 mt-1">{req.business_idea?.slice(0, 60)}...</div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(req.status)}`}>
                                  {req.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review Queue */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                          Pending Reviews
                        </h2>
                        <button 
                          onClick={() => setActiveTab('review-queue')}
                          className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                        >
                          View all <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      {submissions.length === 0 ? (
                        <div className="border border-white/10 p-8 text-center">
                          <p className="text-sm text-white/60">No pending reviews</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {submissions.slice(0, 5).map((sub, i) => (
                            <div 
                              key={sub.submission_id}
                              className="border border-white/10 p-4 hover:border-white/20 transition-colors cursor-pointer"
                              data-testid={`admin-submission-${i}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{sub.summary?.slice(0, 50)}...</div>
                                  <div className="text-xs text-white/60 mt-1">Unit: {sub.unit_id}</div>
                                </div>
                                <button className="text-[#FF3B30] hover:text-white transition-colors text-sm">
                                  Review
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input 
                        type="text"
                        placeholder="Search requests..."
                        className="bg-[#1A1A1A] border border-white/10 pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                  </div>

                  {requests.length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No requests</h3>
                      <p className="text-sm text-white/60">Client requests will appear here</p>
                    </div>
                  ) : (
                    <div className="border border-white/10">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((req, i) => (
                            <tr 
                              key={req.request_id}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              data-testid={`request-row-${i}`}
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium">{req.title}</div>
                                  <div className="text-xs text-white/60 mt-1 line-clamp-1">{req.business_idea}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-white/60">{req.user_id}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(req.status)}`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-white/60">
                                {new Date(req.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {req.status === 'pending' && (
                                    <>
                                      <button className="text-emerald-400 hover:text-white transition-colors text-sm">
                                        Approve
                                      </button>
                                      <button className="text-red-400 hover:text-white transition-colors text-sm">
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button className="text-white/60 hover:text-white transition-colors text-sm">
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {projects.length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <FolderKanban className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No projects</h3>
                      <p className="text-sm text-white/60">Create projects from approved requests</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project, i) => (
                        <div 
                          key={project.project_id}
                          className="border border-white/10 p-6 hover:border-white/20 transition-colors cursor-pointer"
                          data-testid={`admin-project-card-${i}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{project.name}</h3>
                              <span className={`inline-flex items-center px-2 py-1 text-xs mt-2 border ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Stage</span>
                              <span className="capitalize">{project.current_stage}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Work Board Tab */}
              {activeTab === 'work-board' && (
                <div className="space-y-6">
                  {workUnits.length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <GitBranch className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No work units</h3>
                      <p className="text-sm text-white/60">Create work units from project scopes</p>
                    </div>
                  ) : (
                    <div className="border border-white/10">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Assigned</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Hours</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workUnits.map((unit, i) => (
                            <tr 
                              key={unit.unit_id}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              data-testid={`work-unit-row-${i}`}
                            >
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium">{unit.title}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs px-2 py-1 bg-white/5 capitalize">{unit.unit_type}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-white/60">
                                {unit.assigned_to || 'Unassigned'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(unit.status)}`}>
                                  {unit.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-white/60">
                                {unit.actual_hours}/{unit.estimated_hours}h
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Review Queue Tab */}
              {activeTab === 'review-queue' && (
                <div className="space-y-6">
                  {submissions.length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending reviews</h3>
                      <p className="text-sm text-white/60">Submissions awaiting review will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((sub, i) => (
                        <div 
                          key={sub.submission_id}
                          className="border border-white/10 p-6"
                          data-testid={`review-item-${i}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{sub.summary}</h3>
                              <p className="text-sm text-white/60 mt-1">Unit: {sub.unit_id}</p>
                              {sub.links?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {sub.links.map((link, j) => (
                                    <a 
                                      key={j}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2 py-1 bg-white/5 text-[#FF3B30] hover:bg-white/10"
                                    >
                                      Link {j + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                                Approve
                              </button>
                              <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
                                Request Revision
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input 
                        type="text"
                        placeholder="Search users..."
                        className="bg-[#1A1A1A] border border-white/10 pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white/60">{users.length} total users</span>
                    </div>
                  </div>

                  <div className="border border-white/10">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr 
                            key={u.user_id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            data-testid={`user-row-${i}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {u.picture ? (
                                  <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                                    <span className="text-sm">{u.name?.[0]}</span>
                                  </div>
                                )}
                                <span className="text-sm font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-white/60">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 text-xs border capitalize ${getRoleColor(u.role)}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-white/60">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-white/60 hover:text-white transition-colors text-sm">
                                <UserCog className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Developers Tab */}
              {activeTab === 'developers' && (
                <div className="space-y-6">
                  {developers.length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <Code className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No developers</h3>
                      <p className="text-sm text-white/60">Assign developer role to users to see them here</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {developers.map((dev, i) => (
                        <div 
                          key={dev.user_id}
                          className="border border-white/10 p-6"
                          data-testid={`developer-card-${i}`}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            {dev.picture ? (
                              <img src={dev.picture} alt={dev.name} className="w-12 h-12 rounded-full" />
                            ) : (
                              <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                                <span className="text-lg">{dev.name?.[0]}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">{dev.name}</h3>
                              <span className="text-xs text-white/60 capitalize">{dev.level}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Rating</span>
                              <span>{dev.rating}/5</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Completed</span>
                              <span>{dev.completed_tasks} tasks</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Active Load</span>
                              <span>{dev.active_load} tasks</span>
                            </div>
                          </div>
                          {dev.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-4">
                              {dev.skills.slice(0, 3).map((skill, j) => (
                                <span key={j} className="text-xs px-2 py-1 bg-white/5 text-white/60">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Testers Tab */}
              {activeTab === 'testers' && (
                <div className="space-y-6">
                  {testers.length === 0 ? (
                    <div className="border border-white/10 p-12 text-center">
                      <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No testers</h3>
                      <p className="text-sm text-white/60">Assign tester role to users to see them here</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testers.map((tester, i) => (
                        <div 
                          key={tester.user_id}
                          className="border border-white/10 p-6"
                          data-testid={`tester-card-${i}`}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            {tester.picture ? (
                              <img src={tester.picture} alt={tester.name} className="w-12 h-12 rounded-full" />
                            ) : (
                              <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                                <span className="text-lg">{tester.name?.[0]}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">{tester.name}</h3>
                              <span className="text-xs text-emerald-400">QA Tester</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Rating</span>
                              <span>{tester.rating}/5</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Completed</span>
                              <span>{tester.completed_tasks} validations</span>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default AdminDashboard;
