import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  MessageSquare,
  ExternalLink,
  AlertCircle
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
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const getStageProgress = (stage) => {
    const stages = ['discovery', 'scope', 'design', 'development', 'qa', 'delivery', 'support'];
    const index = stages.indexOf(stage);
    return Math.round(((index + 1) / stages.length) * 100);
  };

  const stages = ['discovery', 'scope', 'design', 'development', 'qa', 'delivery', 'support'];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <button onClick={() => navigate('/dashboard')} className="text-white/50 hover:text-white">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="project-details">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-lg font-bold tracking-tight">Dev OS</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="border border-white/10 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <div className="flex items-center gap-4 mt-3">
                <span className={`px-3 py-1 text-sm border ${
                  project.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-white/5 text-white/50 border-white/10'
                }`}>
                  {project.status}
                </span>
                <span className="text-white/50 capitalize">{project.current_stage} Stage</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{getStageProgress(project.current_stage)}%</div>
              <div className="text-white/40 text-sm">Complete</div>
            </div>
          </div>

          {/* Stage Progress */}
          <div className="mt-8">
            <div className="flex items-center gap-1">
              {stages.map((stage, i) => {
                const currentIndex = stages.indexOf(project.current_stage);
                const isComplete = i < currentIndex;
                const isCurrent = i === currentIndex;
                
                return (
                  <div key={stage} className="flex-1 relative">
                    <div className={`h-1.5 ${
                      isComplete ? 'bg-white' : 
                      isCurrent ? 'bg-white/50' : 
                      'bg-white/10'
                    }`} />
                    <div className={`absolute -bottom-6 left-0 text-xs capitalize ${
                      isComplete || isCurrent ? 'text-white/70' : 'text-white/30'
                    }`}>
                      {i === 0 || i === stages.length - 1 || isCurrent ? stage : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Updates */}
            <div className="border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-white/50" />
                Updates
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Project created</div>
                    <div className="text-white/40 text-sm mt-1">
                      Your project is now in the {project.current_stage} stage
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-white/40 text-sm py-4">
                  More updates will appear as your project progresses
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-white/50" />
                Deliverables
              </h2>
              
              {deliverables.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <Package className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No deliverables yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deliverables.map((d) => (
                    <div key={d.deliverable_id} className="p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{d.title}</h3>
                          <p className="text-white/40 text-sm mt-1">{d.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs border ${
                          d.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          d.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      {d.status === 'pending' && (
                        <div className="mt-4 flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-white text-black text-sm font-medium">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 border border-white/20 text-sm">
                            Request Changes
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 border border-white/20 text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Open Support Ticket
                </button>
              </div>
            </div>

            {/* Project Info */}
            <div className="border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Project Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Project ID</span>
                  <span className="font-mono">{project.project_id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Status</span>
                  <span className="capitalize">{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Current Stage</span>
                  <span className="capitalize">{project.current_stage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
