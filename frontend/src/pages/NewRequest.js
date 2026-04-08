import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import {
  ArrowLeft,
  Lightbulb,
  Users,
  DollarSign,
  Clock,
  Send,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const NewRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    business_idea: '',
    target_audience: '',
    budget_range: '',
    timeline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/requests`, formData, { withCredentials: true });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 
            className="text-3xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
          >
            Request Submitted!
          </h1>
          <p className="text-[#0A0A0A]/60">
            We'll review your request and get back to you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]" data-testid="new-request-page">
      {/* Header */}
      <header className="bg-white border-b border-black/5">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors mb-6"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
              >
                Start a New Project
              </h1>
              <p className="text-[#0A0A0A]/60 mt-2">
                Tell us about your idea and we'll help you bring it to life.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Title */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <label className="block text-sm font-medium mb-3">
              Project Title <span className="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., E-Commerce Marketplace, SaaS Dashboard, Mobile App"
              className="w-full bg-[#FAFAFA] border border-black/10 px-5 py-4 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10"
              required
              data-testid="title-input"
            />
          </div>

          {/* Business Idea */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <label className="block text-sm font-medium mb-3">
              <span className="inline-flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#FF6B6B]" />
                Describe Your Business Idea <span className="text-[#FF6B6B]">*</span>
              </span>
            </label>
            <textarea
              name="business_idea"
              value={formData.business_idea}
              onChange={handleChange}
              placeholder="What problem does your product solve? What's the core value proposition? Tell us about your vision..."
              rows={5}
              className="w-full bg-[#FAFAFA] border border-black/10 px-5 py-4 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 resize-none"
              required
              data-testid="business-idea-input"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <label className="block text-sm font-medium mb-3">
              Detailed Description <span className="text-[#FF6B6B]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the key features, functionality, and any specific requirements you have in mind..."
              rows={5}
              className="w-full bg-[#FAFAFA] border border-black/10 px-5 py-4 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 resize-none"
              required
              data-testid="description-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Audience */}
            <div className="bg-white rounded-2xl p-6 border border-black/5">
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0A0A0A]/40" />
                  Target Audience
                </span>
              </label>
              <input
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="e.g., Small businesses"
                className="w-full bg-[#FAFAFA] border border-black/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#FF6B6B]"
                data-testid="target-audience-input"
              />
            </div>

            {/* Budget Range */}
            <div className="bg-white rounded-2xl p-6 border border-black/5">
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#0A0A0A]/40" />
                  Budget Range
                </span>
              </label>
              <select
                name="budget_range"
                value={formData.budget_range}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-black/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#FF6B6B]"
                data-testid="budget-select"
              >
                <option value="">Select range</option>
                <option value="<5k">Less than $5,000</option>
                <option value="5k-15k">$5,000 - $15,000</option>
                <option value="15k-50k">$15,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value=">100k">More than $100,000</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-black/5">
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0A0A0A]/40" />
                  Expected Timeline
                </span>
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-black/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#FF6B6B]"
                data-testid="timeline-select"
              >
                <option value="">Select timeline</option>
                <option value="<1month">Less than 1 month</option>
                <option value="1-3months">1-3 months</option>
                <option value="3-6months">3-6 months</option>
                <option value=">6months">More than 6 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-br from-[#FF6B6B]/5 to-[#FF8E8E]/5 rounded-2xl p-8 border border-[#FF6B6B]/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
              What happens next?
            </h3>
            <ol className="space-y-4 text-sm">
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-medium shadow-sm">1</span>
                <span className="text-[#0A0A0A]/70 pt-1">We'll review your request and reach out within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-medium shadow-sm">2</span>
                <span className="text-[#0A0A0A]/70 pt-1">Our team will define the product scope and create a detailed proposal</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-medium shadow-sm">3</span>
                <span className="text-[#0A0A0A]/70 pt-1">Once approved, we'll begin the structured development process</span>
              </li>
            </ol>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors"
              data-testid="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.business_idea || !formData.description}
              className="flex items-center gap-2 bg-[#FF6B6B] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#FF5A5A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-request-btn"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewRequest;
