import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap } from 'lucide-react';

const skillSuggestions = [
  ['Python', 'JavaScript', 'React', 'HTML/CSS', 'Node.js'],
  ['Canva', 'Figma', 'Adobe XD', 'Video Editing', 'Graphic Design'],
  ['Prompt Engineering', 'ChatGPT', 'Make.com', 'Automation', 'No-Code'],
  ['Content Writing', 'SEO', 'Social Media', 'Marketing', 'Copywriting'],
  ['Data Entry', 'Excel', 'Research', 'Virtual Assistant', 'Translation'],
];

export default function SkillsPage() {
  const navigate = useNavigate();
  const { state, setSkills, setExperienceLevel } = useApp();
  const [skillsInput, setSkillsInput] = useState(state.skills || '');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(
    state.experienceLevel
  );

  const handleSkillClick = (skill: string) => {
    const currentSkills = skillsInput.trim();
    if (currentSkills) {
      setSkillsInput(currentSkills + ', ' + skill);
    } else {
      setSkillsInput(skill);
    }
  };

  const handleGenerate = () => {
    if (!skillsInput.trim()) {
      alert('Please enter your skills');
      return;
    }
    if (!experience) {
      alert('Please select your experience level');
      return;
    }

    setSkills(skillsInput);
    setExperienceLevel(experience);
    navigate('/results');
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Zap className="w-8 h-8 text-[#7c3aed]" />
          <h1 className="text-3xl font-bold text-white">HireReady</h1>
        </div>

        <h2 className="text-4xl font-bold text-white text-center mb-4">What are your skills?</h2>
        <p className="text-[#94a3b8] text-center mb-12">
          Be specific — the more detail, the better your project idea
        </p>

        <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6 mb-8">
          <textarea
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g., JavaScript, React, Node.js, MongoDB, API integration..."
            className="w-full bg-[#0a0a0f] border border-[#7c3aed]/30 rounded-lg px-4 py-3 text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#7c3aed] min-h-[120px] resize-none"
          />
        </div>

        <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4">Quick add skills</h3>
          <div className="space-y-3">
            {skillSuggestions.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-2">
                {row.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    className="bg-[#0a0a0f] hover:bg-[#7c3aed] border border-[#7c3aed]/30 hover:border-[#7c3aed] text-[#94a3b8] hover:text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#13131a] border border-[#7c3aed]/20 rounded-xl p-6 mb-12">
          <h3 className="text-white text-lg font-semibold mb-4">Experience level?</h3>
          <div className="flex gap-4">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setExperience(level)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  experience === level
                    ? 'bg-[#7c3aed] text-white'
                    : 'bg-[#0a0a0f] text-[#94a3b8] border border-[#7c3aed]/30 hover:border-[#7c3aed]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Generate My Project Idea →
          </button>
        </div>
      </div>
    </div>
  );
}
