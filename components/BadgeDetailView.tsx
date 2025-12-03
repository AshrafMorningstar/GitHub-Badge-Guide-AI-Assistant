import React from 'react';
import { Badge } from '../types';

interface BadgeDetailViewProps {
  badge: Badge;
  isOwned: boolean;
  onToggleOwn: () => void;
  onBack: () => void;
}

const BadgeDetailView: React.FC<BadgeDetailViewProps> = ({ badge, isOwned, onToggleOwn, onBack }) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto pt-4">
      <button 
        onClick={onBack}
        className="mb-8 group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-full hover:bg-white dark:hover:bg-white/5"
      >
        <svg className="transition-transform group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Gallery
      </button>

      <div className="glass-panel border-0 dark:border dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Hero Section */}
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center overflow-hidden">
           {/* Dynamic Gradient Background */}
           <div className={`absolute inset-0 opacity-30 dark:opacity-20 blur-[100px] pointer-events-none ${
               badge.rarity === 'Legendary' ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' :
               badge.rarity === 'Rare' ? 'bg-gradient-to-tr from-purple-400 to-pink-500' :
               'bg-gradient-to-tr from-blue-400 to-cyan-500'
           }`}></div>
           
           <div className="relative z-10 flex-shrink-0">
             <div className="text-9xl relative z-10 drop-shadow-2xl animate-pulse-slow">{badge.icon}</div>
           </div>
           
           <div className="flex-1 text-center md:text-left z-10 relative">
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border backdrop-blur-md shadow-sm ${
                  badge.rarity === 'Legendary' ? 'bg-yellow-100/80 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700' : 
                  badge.rarity === 'Rare' ? 'bg-purple-100/80 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700' : 
                  'bg-gray-100/80 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}>
                  {badge.rarity || 'Common'}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-100 dark:border-blue-800 backdrop-blur-md">
                  {badge.category}
                </span>
             </div>
             
             <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">{badge.name}</h1>
             <p className="text-2xl text-gray-600 dark:text-gray-200 leading-relaxed font-light">{badge.description}</p>
             
             <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
               <button 
                  onClick={onToggleOwn}
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl ${
                    isOwned 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30' 
                    : 'bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20'
                  }`}
               >
                 {isOwned ? (
                   <>
                     <div className="bg-white/20 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     Badge Owned
                   </>
                 ) : (
                   <>
                     <div className="bg-black/5 dark:bg-white/10 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                     </div>
                     Add to Collection
                   </>
                 )}
               </button>
             </div>
           </div>
        </div>

        {/* Details Section */}
        <div className="p-10 md:p-16 bg-white/60 dark:bg-[#0d1117]/80 backdrop-blur-xl border-t border-white/50 dark:border-white/5">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm">Target</span>
                Earning Strategy
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                   <div className="bg-white dark:bg-[#161b22] rounded-2xl p-8 border border-gray-200 dark:border-white/5 shadow-sm">
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        To earn the <strong>{badge.name}</strong> achievement, you generally need to engage in {badge.category} activities. <br/><br/>
                        Specific Requirement: <span className="text-blue-600 dark:text-blue-400 font-semibold">{badge.description}</span>
                      </p>
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start">
                         <div className="text-blue-500 mt-1">
                             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         </div>
                         <p className="text-sm text-blue-800 dark:text-blue-200">
                             Ensure your activities are public if you want them to count towards profile badges immediately.
                             Updates to your profile may take up to 24 hours.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="md:col-span-1">
                   <div className="bg-white dark:bg-[#161b22] rounded-2xl p-8 border border-gray-200 dark:border-white/5 h-full shadow-sm">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                             <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs">lvl</span>
                             Progression Tiers
                        </h4>
                        
                        {badge.tiers ? (
                            <div className="relative pl-4 space-y-6">
                                {/* Timeline Line */}
                                <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-white/10"></div>
                                
                                {badge.tiers.map((tier, idx) => (
                                    <div key={idx} className="relative flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-white dark:bg-[#161b22] border-2 border-blue-500 z-10"></div>
                                        <div className="bg-gray-50 dark:bg-white/5 px-3 py-2 rounded-lg border border-gray-100 dark:border-white/5 w-full">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tier}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-2 opacity-30">⭐</div>
                                <p className="text-gray-500 text-sm">Single Tier Achievement</p>
                            </div>
                        )}
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDetailView;