import React from 'react';
import { RefreshCw, Code, User, Smile } from 'lucide-react';
import { getRandomTitleDifferentThan } from '../utils/builderTitles';

interface DetailsFormProps {
  name: string;
  role: string;
  funFact: string;
  title: string;
  onUpdate: (fields: Partial<{ name: string; role: string; funFact: string; title: string }>) => void;
}

export default function DetailsForm({ name, role, funFact, title, onUpdate }: DetailsFormProps) {
  
  const handleRegenerateTitle = () => {
    const nextTitle = getRandomTitleDifferentThan(title);
    onUpdate({ title: nextTitle });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value.slice(0, 30) });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ role: e.target.value.slice(0, 40) });
  };

  const handleFunFactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ funFact: e.target.value.slice(0, 60) });
  };

  return (
    <div className="bg-obsidian-light/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-goa-emerald/5 blur-3xl rounded-full"></div>
      
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-goa-emerald"></span>
          <span>A few details</span>
        </h3>
        <p className="text-slate-400 text-xs mt-1">
          The preview updates instantly.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name-input" className="text-xs font-mono text-goa-emerald font-bold tracking-wider uppercase block">
            Your name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name-input"
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
              className="w-full bg-obsidian-dark/80 text-white placeholder-slate-600 border border-slate-800 focus:border-goa-emerald focus:ring-1 focus:ring-goa-emerald rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-semibold"
            />
          </div>
        </div>

        {/* Stack/Role Input */}
        <div className="space-y-2">
          <label htmlFor="role-input" className="text-xs font-mono text-goa-emerald font-bold tracking-wider uppercase block">
            What do you build?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Code className="w-4 h-4" />
            </div>
            <input
              id="role-input"
              type="text"
              required
              placeholder="What do you build?"
              value={role}
              onChange={handleRoleChange}
              className="w-full bg-obsidian-dark/80 text-white placeholder-slate-600 border border-slate-800 focus:border-goa-emerald focus:ring-1 focus:ring-goa-emerald rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-semibold"
            />
          </div>
        </div>

        {/* Fun Fact Input */}
        <div className="space-y-2">
          <label htmlFor="funfact-input" className="text-xs font-mono text-slate-400 tracking-wider uppercase block">
            One fun fact (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Smile className="w-4 h-4" />
            </div>
            <input
              id="funfact-input"
              type="text"
              placeholder="One fun fact (optional)"
              value={funFact}
              onChange={handleFunFactChange}
              className="w-full bg-obsidian-dark/80 text-white placeholder-slate-600 border border-slate-800 focus:border-goa-emerald focus:ring-1 focus:ring-goa-emerald rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-semibold"
            />
          </div>
        </div>

        {/* Builder Title */}
        <div className="bg-obsidian-dark/50 border border-slate-800/80 rounded-2xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
              Your builder title
            </span>
            <button
              type="button"
              onClick={handleRegenerateTitle}
              className="flex items-center space-x-1.5 text-xs text-goa-emerald hover:text-goa-emerald/80 active:scale-95 transition-all outline-none font-mono py-1 px-2.5 bg-goa-emerald/10 rounded-lg border border-goa-emerald/20 hover:border-goa-emerald/30 select-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Roll title</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3 bg-obsidian-dark p-3.5 rounded-xl border border-slate-800/40">
            <span className="text-2xl" role="img" aria-label="badge">🏷️</span>
            <div>
              <p className="text-slate-500 text-[10px] font-mono leading-none mb-1">
                Current title
              </p>
              <p className="text-white font-bold text-sm tracking-wide font-mono">
                {title.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
