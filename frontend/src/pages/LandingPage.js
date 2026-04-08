import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { ArrowRight, ArrowUpRight, Check, Plus, Minus } from 'lucide-react';

const LandingPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${API}/stats`);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  const faqs = [
    {
      q: 'How is this different from hiring freelancers?',
      a: 'With freelancers, you manage everything yourself — selection, quality, communication, conflicts. With us, you get a unified standard, centralized quality control, and receive already-verified results.'
    },
    {
      q: 'How is this different from traditional agencies?',
      a: 'Agencies are often expensive with heavy processes and low transparency. We offer a structured system with transparent progress, predictable timelines, and minimal unnecessary communication.'
    },
    {
      q: 'Can I communicate directly with developers?',
      a: 'No. This is a fundamental principle: Client ↔ Platform ↔ Internal Team. This maintains a unified standard, keeps clients from drowning in process, and ensures the system remains scalable.'
    },
    {
      q: 'What happens after release?',
      a: 'The project doesn\'t die. It moves to support: bugs, improvements, upgrades, change requests. The product continues to live and evolve.'
    },
    {
      q: 'How is pricing determined?',
      a: 'Based on scope. After Product Definition, we create a clear scope of work with transparent pricing. No hidden charges.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <nav className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">Development OS</span>
          </a>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#about" className="text-[15px] text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors">About</a>
            <a href="#process" className="text-[15px] text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors">Process</a>
            <a href="#pricing" className="text-[15px] text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors">Pricing</a>
            <a href="#faq" className="text-[15px] text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors">FAQ</a>
          </div>

          <button 
            onClick={user ? () => navigate('/dashboard') : login}
            className="bg-[#0A0A0A] text-white px-6 py-3 text-[15px] font-medium rounded-full hover:bg-[#0A0A0A]/90 transition-colors inline-flex items-center gap-2"
            data-testid="login-btn"
          >
            {user ? 'Dashboard' : 'Book a Call'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8" data-testid="hero-section">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[15px] text-[#0A0A0A]/50 mb-6 tracking-wide">
                The operating system for managed development
              </p>
              <h1 className="text-[56px] lg:text-[72px] font-bold leading-[1.05] tracking-tight mb-8">
                From idea
                <br />
                to product.
                <br />
                <span className="text-[#0A0A0A]/25">No chaos.</span>
              </h1>
              <p className="text-[18px] text-[#0A0A0A]/60 leading-relaxed mb-10 max-w-[480px]">
                You come with an idea — the platform transforms it into a clear, 
                structured, controlled product development process.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-[#0A0A0A] text-white px-8 py-4 text-[15px] font-medium rounded-full hover:bg-[#0A0A0A]/90 transition-colors inline-flex items-center gap-2"
                  data-testid="get-started-btn"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a 
                  href="#process"
                  className="px-8 py-4 text-[15px] font-medium border border-[#0A0A0A]/15 rounded-full hover:border-[#0A0A0A]/30 transition-colors"
                >
                  See How It Works
                </a>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#f8f8f8] to-[#f0f0f0]">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl shadow-black/10 p-6 border border-black/5">
                <div className="text-[32px] font-bold">{stats?.completed_projects || '150'}+</div>
                <div className="text-[14px] text-[#0A0A0A]/50">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Stats Strip */}
      <section className="py-16 px-8 border-y border-black/5 bg-[#FAFAFA]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-[40px] font-bold tracking-tight">{stats?.completed_projects || '150'}+</div>
              <div className="text-[14px] text-[#0A0A0A]/50 mt-1">Projects Delivered</div>
            </div>
            <div>
              <div className="text-[40px] font-bold tracking-tight">{stats?.satisfaction_rate || '98.5'}%</div>
              <div className="text-[14px] text-[#0A0A0A]/50 mt-1">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-[40px] font-bold tracking-tight">2 of 3</div>
              <div className="text-[14px] text-[#0A0A0A]/50 mt-1">Clients Return</div>
            </div>
            <div>
              <div className="text-[40px] font-bold tracking-tight">4 weeks</div>
              <div className="text-[14px] text-[#0A0A0A]/50 mt-1">Avg. Delivery Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="py-32 px-8" id="about">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Team working"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Text side */}
            <div>
              <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-4">The Challenge</p>
              <h2 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight mb-8">
                Between a client's idea and a finished product lies chaos.
              </h2>
              <div className="space-y-6 text-[17px] text-[#0A0A0A]/60 leading-relaxed">
                <p>
                  The market is divided into freelance chaos with inconsistent quality, 
                  heavyweight agencies with opaque processes, and AI generators that offer 
                  no real accountability.
                </p>
                <p>
                  Clients don't understand how to describe their product, don't know who to hire, 
                  can't evaluate developers, face poor communication, and deal with missed deadlines.
                </p>
                <p className="text-[#0A0A0A] font-medium">
                  We're the fourth path — a managed production system that transforms this chaos 
                  into predictable, quality-assured delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Statement */}
      <section className="py-24 px-8 bg-[#0A0A0A] text-white">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.15] tracking-tight">
            Not a studio. Not a marketplace.
            <br />
            <span className="text-white/40">An operating system for product development.</span>
          </h2>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-8" id="process" data-testid="process-section">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-[600px] mb-20">
            <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-4">Our Process</p>
            <h2 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Request', desc: 'Submit your idea in any format. No need to know tech stacks or architecture.' },
              { num: '02', title: 'Product Definition', desc: 'We transform your request into a clear product entity: type, goal, audience, key features.' },
              { num: '03', title: 'Scope', desc: 'Clear scope of work is defined: what\'s included, what\'s core, what\'s optional, and the commercial volume.' },
              { num: '04', title: 'Production', desc: 'Work units are assigned to developers. They log hours and submit results to the platform, not to you.' },
              { num: '05', title: 'Review & Validation', desc: 'Admin review checks task compliance. Tester validation checks visual, adaptive, flow, and UX.' },
              { num: '06', title: 'Deliverable', desc: 'Packaged client result. You approve the clear outcome, not the internal kitchen.' }
            ].map((item, i) => (
              <div 
                key={item.num}
                className="p-8 border border-black/10 rounded-2xl hover:border-black/20 transition-colors"
                data-testid={`process-step-${i}`}
              >
                <span className="text-[13px] text-[#0A0A0A]/30 font-mono">{item.num}</span>
                <h3 className="text-[22px] font-semibold mt-4 mb-3">{item.title}</h3>
                <p className="text-[15px] text-[#0A0A0A]/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Principle */}
      <section className="py-24 px-8 bg-[#FAFAFA]">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-6">Key Principle</p>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-8">
            Client ↔ Platform ↔ Internal Team
          </h2>
          <p className="text-[18px] text-[#0A0A0A]/60 leading-relaxed max-w-[700px] mx-auto">
            You never communicate directly with developers. This maintains a unified standard, 
            keeps you from drowning in process details, and ensures the system remains scalable 
            with centralized quality control.
          </p>
        </div>
      </section>

      {/* Showcase Image Section */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"
              alt="Dashboard showcase"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-32 px-8 bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-[600px] mb-20">
            <p className="text-[14px] text-white/50 uppercase tracking-wider mb-4">System Roles</p>
            <h2 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight">
              Four roles, one system
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Client', desc: 'Creates requests, views projects, receives updates, approves results, opens support tickets.' },
              { title: 'Developer', desc: 'Receives assignments, logs work hours, submits results to platform. No direct client interaction.' },
              { title: 'Tester', desc: 'Validates visual design, responsiveness, user flows, UX. Works through platform as quality control layer.' },
              { title: 'Admin', desc: 'Processes requests, builds scope, assigns executors, controls review, packages deliverables.' }
            ].map((role, i) => (
              <div 
                key={role.title}
                className="p-8 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
                data-testid={`role-card-${i}`}
              >
                <h3 className="text-[24px] font-semibold mb-4">{role.title}</h3>
                <p className="text-[16px] text-white/60 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Engine */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-[600px] mb-20">
            <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-4">Production Engine</p>
            <h2 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight">
              The system core
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[20px] font-semibold mb-6 pb-4 border-b border-black/10">Product Core</h3>
              <ul className="space-y-3 text-[16px] text-[#0A0A0A]/60">
                <li>Request</li>
                <li>Product Definition</li>
                <li>Scope & Scope Items</li>
                <li>Project & Stages</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[20px] font-semibold mb-6 pb-4 border-b border-black/10">Production Core</h3>
              <ul className="space-y-3 text-[16px] text-[#0A0A0A]/60">
                <li>Work Units</li>
                <li>Assignments</li>
                <li>Work Logs & Submissions</li>
                <li>Review & Validation</li>
                <li>Deliverables & Approvals</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[20px] font-semibold mb-6 pb-4 border-b border-black/10">Lifecycle Core</h3>
              <ul className="space-y-3 text-[16px] text-[#0A0A0A]/60">
                <li>Support Tickets</li>
                <li>Versions</li>
                <li>Bugs & Improvements</li>
                <li>Change Requests</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-8 bg-[#FAFAFA]" id="pricing" data-testid="pricing-section">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-20">
            <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-4">Pricing</p>
            <h2 className="text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight">
              Transparent model
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-black/5">
              <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-2">Monthly Retainer</p>
              <div className="text-[48px] font-bold tracking-tight mb-2">$4,000<span className="text-[20px] font-normal text-[#0A0A0A]/40">/mo</span></div>
              <p className="text-[16px] text-[#0A0A0A]/60 mb-8">
                Ongoing partnership for teams who want to move fast without building in-house.
              </p>
              <ul className="space-y-4 mb-10">
                {['Progress every 2 business days', 'All services under one partnership', 'Direct Slack communication', 'Cancel anytime'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[15px] text-[#0A0A0A]/70">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleGetStarted}
                className="w-full bg-[#0A0A0A] text-white py-4 text-[15px] font-medium rounded-full hover:bg-[#0A0A0A]/90 transition-colors"
              >
                Book a Call
              </button>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-black/5">
              <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-2">Custom Project</p>
              <div className="text-[48px] font-bold tracking-tight mb-2">Get a Quote</div>
              <p className="text-[16px] text-[#0A0A0A]/60 mb-8">
                Fixed scope, deliverables and timeline. Perfect for 0→1 launches and redesigns.
              </p>
              <ul className="space-y-4 mb-10">
                {['Defined scope & deliverables', 'Senior-led execution', 'Clear communication throughout', 'Best for clear outcomes'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[15px] text-[#0A0A0A]/70">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleGetStarted}
                className="w-full border border-[#0A0A0A] text-[#0A0A0A] py-4 text-[15px] font-medium rounded-full hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-8" id="faq" data-testid="faq-section">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[14px] text-[#0A0A0A]/50 uppercase tracking-wider mb-4">FAQ</p>
            <h2 className="text-[40px] font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-black/10">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left"
                  data-testid={`faq-${i}`}
                >
                  <span className="text-[17px] font-medium pr-8">{faq.q}</span>
                  {openFaq === i ? (
                    <Minus className="w-5 h-5 text-[#0A0A0A]/40 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#0A0A0A]/40 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="pb-6">
                    <p className="text-[16px] text-[#0A0A0A]/60 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-32 px-8 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-square rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                alt="Founder"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.15] tracking-tight mb-6">
                Hey, I'm the founder of Development OS.
              </h2>
              <div className="space-y-4 text-[17px] text-[#0A0A0A]/60 leading-relaxed">
                <p>
                  I've spent years watching talented teams struggle with the chaos of product development — 
                  miscommunication, scope creep, quality issues, and missed deadlines.
                </p>
                <p>
                  Development OS was built to solve this. We're not just here to write code. 
                  We're product people at heart who think deeply about how development ties into 
                  traction, conversion, and growth.
                </p>
                <p className="text-[#0A0A0A]">
                  If that sounds like the kind of partnership you're looking for, let's talk.
                </p>
              </div>
              <button 
                onClick={handleGetStarted}
                className="mt-8 bg-[#0A0A0A] text-white px-8 py-4 text-[15px] font-medium rounded-full hover:bg-[#0A0A0A]/90 transition-colors inline-flex items-center gap-2"
              >
                Book a Call
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 bg-[#0A0A0A] text-white" data-testid="cta-section">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-6">
            Ready to build
            <br />
            something real?
          </h2>
          <p className="text-[18px] text-white/60 mb-10 max-w-[500px] mx-auto">
            You get results, not chaos. The platform manages the production system, not the people.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-white text-[#0A0A0A] px-10 py-5 text-[16px] font-medium rounded-full hover:bg-white/90 transition-colors inline-flex items-center gap-2"
            data-testid="cta-start-project-btn"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-black/5" data-testid="footer">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <span className="text-xl font-bold tracking-tight">Development OS</span>
          <span className="text-[14px] text-[#0A0A0A]/50">
            © {new Date().getFullYear()} Development OS. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
