import { useNavigate } from 'react-router-dom';
import { Zap, Target, CheckCircle, BookOpen } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/10 via-transparent to-[#7c3aed]/5 animate-pulse"
           style={{ animationDuration: '4s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-10 h-10 text-[#7c3aed]" strokeWidth={2.5} />
          <h1 className="text-5xl font-bold text-white">HireReady</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Turn your skills into projects<br />that get you hired
          </h2>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            AI-powered project ideas for beginners and freelancers
          </p>
        </div>

        <div className="flex justify-center mb-20">
          <button
            onClick={() => navigate('/setup')}
            className="group bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            Get My Project Idea
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Target className="w-8 h-8 text-[#7c3aed]" />}
            title="Personalized Ideas"
            description="Get project suggestions tailored to your exact skill set and experience level"
          />
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8 text-[#7c3aed]" />}
            title="Recruiter-Approved"
            description="Ideas designed by tech recruiters to showcase skills that actually matter"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-[#7c3aed]" />}
            title="Step-by-Step Guide"
            description="Clear roadmap from idea to completion with pro tips to stand out"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6 hover:border-[#7c3aed]/40 transition-all duration-300 hover:transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[#94a3b8] leading-relaxed">{description}</p>
    </div>
  );
}
