
import React, { useState, useCallback } from 'react';
import { Bike, Compass, Sun, Euro, MapPin, Loader2, Sparkles, Send } from 'lucide-react';
import { findOptimalLocation } from './services/geminiService';
import { TripParameters } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<TripParameters>({
    distanceToRotterdam: 1100,
    terrain: 10,
    bigMacIndex: 2,
    sunnyWeatherChance: 85,
    additionalInput: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSliderChange = (key: keyof TripParameters, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await findOptimalLocation(params);
      setResult(output);
    } catch (err) {
      console.error(err);
      setError("The grid is offline! (API Error)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 md:px-0">
      {/* Retro Header */}
      <header className="mb-12 text-center relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
        <div className="relative bg-black px-8 py-6 rounded-lg border border-pink-500 neon-border-pink">
          <h1 className="font-spacy text-3xl md:text-5xl font-black text-pink-500 neon-text-pink uppercase tracking-widest mb-2">
            RCdeRC Trip Location Finder
          </h1>
          <p className="font-spacy text-sm md:text-lg text-cyan-400 tracking-tighter uppercase italic">
            Official RCdeRC Trip Navigator
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {/* Input Controls */}
        <section className="bg-black/80 p-8 rounded-2xl border border-pink-500/30 backdrop-blur-md neon-glow-pink h-fit">
          <h2 className="font-spacy text-xl text-pink-400 mb-8 border-b border-pink-500/30 pb-2 flex items-center gap-2">
            <Compass className="w-5 h-5" /> PARAMETERS
          </h2>
          
          <div className="space-y-8">
            {/* Distance */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-spacy uppercase tracking-wider text-cyan-300">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Distance from R'dam</span>
                <span className="text-pink-500">{params.distanceToRotterdam} km</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="3000" 
                step="50"
                value={params.distanceToRotterdam}
                onChange={(e) => handleSliderChange('distanceToRotterdam', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Terrain */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-spacy uppercase tracking-wider text-cyan-300">
                <span className="flex items-center gap-2"><Bike className="w-4 h-4" /> Flat to Mountains</span>
                <span className="text-pink-500">{params.terrain}/10</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={params.terrain}
                onChange={(e) => handleSliderChange('terrain', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Big Mac Index */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-spacy uppercase tracking-wider text-cyan-300">
                <span className="flex items-center gap-2"><Euro className="w-4 h-4" /> Big Mac Index</span>
                <span className="text-pink-500">{params.bigMacIndex}/20</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={params.bigMacIndex}
                onChange={(e) => handleSliderChange('bigMacIndex', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Weather */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-spacy uppercase tracking-wider text-cyan-300">
                <span className="flex items-center gap-2"><Sun className="w-4 h-4" /> Sun Chance</span>
                <span className="text-pink-500">{params.sunnyWeatherChance}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={params.sunnyWeatherChance}
                onChange={(e) => handleSliderChange('sunnyWeatherChance', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <label className="block text-sm font-spacy uppercase tracking-wider text-cyan-300">Extra Vibes (Gravel, Beer, etc.)</label>
              <textarea 
                className="w-full bg-black border border-pink-500/30 rounded-lg p-3 text-pink-100 focus:outline-none focus:border-pink-500 transition-colors h-24 font-mono text-sm"
                placeholder="Ex: Good craft beer, paved only, no wind..."
                value={params.additionalInput}
                onChange={(e) => setParams(prev => ({ ...prev, additionalInput: e.target.value }))}
              />
            </div>

            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-spacy font-bold rounded-lg transition-all flex items-center justify-center gap-2 neon-glow-pink uppercase tracking-widest ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Calculating Path...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Find the Destination</>
              )}
            </button>
          </div>
        </section>

        {/* Display Result */}
        <section className="bg-black/80 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-md min-h-[400px] flex flex-col">
           <h2 className="font-spacy text-xl text-cyan-400 mb-8 border-b border-cyan-500/30 pb-2 flex items-center gap-2">
            <Send className="w-5 h-5" /> EXPEDITION INTEL
          </h2>
          
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-75">
               <div className="relative">
                 <Bike className="w-16 h-16 text-pink-500 animate-bounce" />
                 <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 animate-pulse"></div>
               </div>
               <p className="font-spacy text-pink-400 animate-pulse text-center">SCANNING THE CONTINENT FOR OPTIMAL RIDES...</p>
            </div>
          )}

          {!isLoading && !result && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-cyan-500/20 rounded-xl">
               <Compass className="w-12 h-12 text-cyan-800 mb-4" />
               <p className="text-cyan-600 font-spacy text-sm uppercase">Awaiting input parameters to plot coordinates.</p>
            </div>
          )}

          {error && (
            <div className="flex-1 flex flex-col items-center justify-center text-red-500 font-spacy uppercase p-6 border border-red-500/50 rounded-xl bg-red-950/20">
               <p>{error}</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar animate-in fade-in duration-500">
               <div className="prose prose-invert prose-pink max-w-none text-cyan-100">
                 {result.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-spacy text-pink-500 mt-4 mb-2">{line.replace('# ', '')}</h1>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-spacy text-pink-400 mt-4 mb-2 border-b border-pink-900 pb-1 uppercase">{line.replace('## ', '')}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-spacy text-cyan-400 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('- ') || line.startsWith('* ')) return <div key={i} className="ml-4 mb-1 text-cyan-200">• {line.substring(2)}</div>;
                    return <p key={i} className="mb-3 leading-relaxed text-cyan-100/90">{line}</p>;
                 })}
               </div>
               
               <div className="pt-6 border-t border-cyan-500/20">
                 <div className="bg-cyan-950/30 p-4 rounded-lg border border-cyan-500/20">
                   <h4 className="font-spacy text-xs text-cyan-500 mb-2 uppercase tracking-widest">RCdeRC Intelligence Note</h4>
                   <p className="text-xs italic text-cyan-400/80">
                     Results are synthesized using Gemini 2.5 Flash with Real-time Grounding. Please verify route viability before departure.
                   </p>
                 </div>
               </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto w-full max-w-4xl border-t border-pink-500/20 pt-6 text-center opacity-60">
        <p className="font-spacy text-[10px] text-pink-400 uppercase tracking-[0.3em]">
          Ride the light • RCdeRC • {new Date().getFullYear()} • Est. Rotterdam
        </p>
      </footer>
    </div>
  );
};

export default App;
