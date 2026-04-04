import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap, Sparkles, Key } from 'lucide-react';

export default function SetupPage() {
  const navigate = useNavigate();
  const { setAIProvider, setAPIKey } = useApp();
  const [selectedOption, setSelectedOption] = useState<'free' | 'custom'>('free');
  const [customProvider, setCustomProvider] = useState<'claude' | 'openai' | 'groq'>('groq');
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleContinue = () => {
    if (selectedOption === 'free') {
      setAIProvider('groq');
      setAPIKey(import.meta.env.VITE_GROQ_API_KEY || '');
    } else {
      if (!apiKeyInput.trim()) {
        alert('Please enter your API key');
        return;
      }
      setAIProvider(customProvider);
      setAPIKey(apiKeyInput);
    }
    navigate('/skills');
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Zap className="w-8 h-8 text-[#7c3aed]" />
          <h1 className="text-3xl font-bold text-white">HireReady</h1>
        </div>

        <h2 className="text-4xl font-bold text-white text-center mb-4">Choose your AI</h2>
        <p className="text-[#94a3b8] text-center mb-12">Select how you want to generate your project idea</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div
            onClick={() => setSelectedOption('free')}
            className={`bg-[#13131a] border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              selectedOption === 'free'
                ? 'border-[#7c3aed] shadow-lg shadow-[#7c3aed]/20'
                : 'border-[#7c3aed]/20 hover:border-[#7c3aed]/40'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <Sparkles className="w-8 h-8 text-[#7c3aed]" />
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </span>
            </div>
            <h3 className="text-white text-2xl font-semibold mb-2">Use Free AI</h3>
            <p className="text-[#94a3b8] mb-4">Groq — Fast, free, no API key needed</p>
            <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              FREE
            </div>
          </div>

          <div
            onClick={() => setSelectedOption('custom')}
            className={`bg-[#13131a] border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              selectedOption === 'custom'
                ? 'border-[#7c3aed] shadow-lg shadow-[#7c3aed]/20'
                : 'border-[#7c3aed]/20 hover:border-[#7c3aed]/40'
            }`}
          >
            <div className="mb-4">
              <Key className="w-8 h-8 text-[#7c3aed]" />
            </div>
            <h3 className="text-white text-2xl font-semibold mb-2">Use My Own API Key</h3>
            <p className="text-[#94a3b8] mb-4">Claude / OpenAI / Groq</p>

            {selectedOption === 'custom' && (
              <div className="space-y-4 mt-6">
                <select
                  value={customProvider}
                  onChange={(e) => setCustomProvider(e.target.value as 'claude' | 'openai' | 'groq')}
                  className="w-full bg-[#0a0a0f] border border-[#7c3aed]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="groq">Groq (Free)</option>
                  <option value="claude">Claude (Anthropic)</option>
                  <option value="openai">OpenAI (GPT)</option>
                </select>

                <input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-[#0a0a0f] border border-[#7c3aed]/30 rounded-lg px-4 py-3 text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#7c3aed]"
                />

                <p className="text-[#94a3b8] text-sm">Your key is never stored</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
