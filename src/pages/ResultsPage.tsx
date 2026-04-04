import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateProjectIdea } from '../services/aiService';
import { parseProjectResponse, ParsedProject } from '../utils/responseParser';
import { generatePDF } from '../utils/pdfGenerator';
import { Zap, Loader2, Download, RotateCcw, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state, resetState } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ParsedProject | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));

  useEffect(() => {
    if (!state.aiProvider || !state.skills || !state.experienceLevel) {
      navigate('/');
      return;
    }

    const fetchProjectIdea = async () => {
      try {
        setLoading(true);
        const response = await generateProjectIdea(
          state.aiProvider!,
          state.skills,
          state.experienceLevel!,
          state.apiKey || undefined
        );
        const parsed = parseProjectResponse(response);
        setProject(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while generating your project idea');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectIdea();
  }, [state, navigate]);

  const handleDownloadPDF = () => {
    if (project) {
      generatePDF(project);
    }
  };

  const handleTryAgain = () => {
    resetState();
    navigate('/skills');
  };

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#7c3aed] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Project Idea...</h2>
          <p className="text-[#94a3b8]">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-[#13131a] border border-red-500/30 rounded-xl p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-[#94a3b8] mb-8">{error}</p>
          <button
            onClick={() => navigate('/setup')}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Zap className="w-8 h-8 text-[#7c3aed]" />
          <h1 className="text-3xl font-bold text-white">HireReady</h1>
        </div>

        <div className="bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-xl p-8 mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">{project.projectName}</h2>
          <p className="text-white/80">Your personalized portfolio project</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-[#7c3aed] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Problem It Solves</h3>
                <p className="text-[#94a3b8] leading-relaxed">{project.problemItSolves}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-[#7c3aed] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Why Recruiters Love It</h3>
                <p className="text-[#94a3b8] leading-relaxed">{project.whyRecruitersLoveIt}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4">Project Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[#94a3b8] text-sm mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.split(',').map((tech, i) => (
                  <span
                    key={i}
                    className="bg-[#7c3aed]/20 text-[#7c3aed] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-white font-medium">{project.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-white font-medium">{project.timeToBuild}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4">Step-by-Step Guide</h3>
          <div className="space-y-3">
            {project.steps.map((step, index) => (
              <div key={index} className="border border-[#7c3aed]/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleStep(index)}
                  className="w-full bg-[#0a0a0f] hover:bg-[#0a0a0f]/50 px-4 py-3 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-[#7c3aed] text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-white font-medium">{step.title}</span>
                  </div>
                  <span className="text-[#7c3aed]">{expandedSteps.has(index) ? '−' : '+'}</span>
                </button>
                {expandedSteps.has(index) && (
                  <div className="px-4 py-3 bg-[#0a0a0f]/30">
                    <p className="text-[#94a3b8] leading-relaxed">{step.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#6d28d9]/20 border-2 border-[#7c3aed] rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-[#7c3aed] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">Pro Tip</h3>
              <p className="text-white leading-relaxed">{project.proTip}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF Guide
          </button>
          <button
            onClick={handleTryAgain}
            className="bg-[#13131a] hover:bg-[#13131a]/70 border border-[#7c3aed]/30 hover:border-[#7c3aed] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Another Skill Set
          </button>
        </div>
      </div>
    </div>
  );
}
