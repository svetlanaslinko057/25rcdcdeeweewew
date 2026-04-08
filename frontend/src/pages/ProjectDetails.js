import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Plus
} from 'lucide-react';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, deliverablesRes] = await Promise.all([
          axios.get(`${API}/projects/${projectId}`, { withCredentials: true }),
          axios.get(`${API}/projects/${projectId}/deliverables`, { withCredentials: true })
        ]);
        setProject(projectRes.data);
        setDeliverables(deliverablesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const stages = [
    { id: 'discovery', label: 'Discovery' },
    { id: 'scope', label: 'Scope' },
    { id: 'design', label: 'Design' },
    { id: 'development', label: 'Development' },
    { id: 'qa', label: 'QA' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'support', label: 'Support' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === project?.current_stage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF3B30] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[#FF3B30] hover:text-white transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="project-details-page">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
            data-testid="back-to-dashboard-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
              >
                {project.name}
              </h1>
              <p className="text-white/60 mt-2">
                Project ID: {project.project_id}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 text-sm border ${
              project.status === 'active' 
                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' 
                : 'text-white/60 bg-white/10 border-white/20'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Progress Timeline */}
        <section className="mb-12">
          <h2 
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
          >
            Project Progress
          </h2>
          <div className="relative">
            {/* Progress Bar */}
            <div className="h-1 bg-white/10 absolute top-5 left-0 right-0" />
            <div 
              className="h-1 bg-[#FF3B30] absolute top-5 left-0 transition-all"
              style={{ width: `${((getCurrentStageIndex() + 1) / stages.length) * 100}%` }}
            />
            
            {/* Stage Markers */}
            <div className="relative flex justify-between">
              {stages.map((stage, i) => {
                const isCompleted = i < getCurrentStageIndex();
                const isCurrent = i === getCurrentStageIndex();
                
                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 flex items-center justify-center border-2 z-10 ${
                        isCompleted 
                          ? 'bg-[#FF3B30] border-[#FF3B30]' 
                          : isCurrent 
                            ? 'bg-[#0A0A0A] border-[#FF3B30]' 
                            : 'bg-[#0A0A0A] border-white/20'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className={`text-sm ${isCurrent ? 'text-[#FF3B30]' : 'text-white/40'}`}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs mt-3 ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deliverables */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
                >
                  Deliverables
                </h2>
              </div>

              {deliverables.length === 0 ? (
                <div className="border border-white/10 p-12 text-center">
                  <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No deliverables yet</h3>
                  <p className="text-sm text-white/60">
                    Deliverables will appear here as your project progresses
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliverables.map((d, i) => (
                    <div 
                      key={d.deliverable_id}
                      className="border border-white/10 p-6"
                      data-testid={`deliverable-${i}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{d.title}</h3>
                          <p className="text-sm text-white/60 mt-1">{d.description}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs border ${getStatusColor(d.status)}`}>
                          {d.status}
                        </span>
                      </div>
                      
                      {d.links?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {d.links.map((link, j) => (
                            <a 
                              key={j}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-white/5 text-[#FF3B30] hover:bg-white/10 transition-colors"
                            >
                              View Link {j + 1}
                            </a>
                          ))}
                        </div>
                      )}

                      {d.status === 'pending' && (
                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                          <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
                            Request Changes
                          </button>
                        </div>
                      )}

                      {d.client_feedback && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-sm text-white/60">
                            <strong>Your feedback:</strong> {d.client_feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Project Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Current Stage</span>
                  <span className="capitalize">{project.current_stage}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Created</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <p className="text-sm text-white/60 mb-4">
                Have questions or found an issue? Create a support ticket.
              </p>
              <button 
                className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-3 text-sm hover:bg-white/10 transition-colors"
                data-testid="create-support-ticket-btn"
              >
                <MessageSquare className="w-4 h-4" />
                Create Support Ticket
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
