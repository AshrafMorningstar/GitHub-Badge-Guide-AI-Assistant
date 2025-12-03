import React from 'react';
import { Badge } from '../types';

interface BadgeListProps {
  badges: Badge[];
  ownedIds: Set<string>;
  onBadgeClick: (badge: Badge) => void;
}

const BadgeList: React.FC<BadgeListProps> = ({ badges, ownedIds, onBadgeClick }) => {
  if (badges.length === 0) {
    return (
      <div className="text-center py-24 bg-white/50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-3xl backdrop-blur-md">
        <div className="text-5xl mb-6 opacity-30 grayscale">🔍</div>
        <p className="text-gray-600 dark:text-gray-300 font-bold text-xl">No badges found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
      {badges.map((badge, idx) => {
        const isOwned = ownedIds.has(badge.id);
        // Staggered animation delay
        const delayStyle = { animationDelay: `${idx * 50}ms` };
        
        return (
          <div 
            key={badge.id} 
            style={delayStyle}
            onClick={() => onBadgeClick(badge)}
            className={`
              group relative flex flex-col p-6 rounded-2xl border cursor-pointer overflow-hidden animate-slide-up
              transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl hover:z-10
              backdrop-blur-md
              ${isOwned 
                ? 'bg-gradient-to-br from-white to-blue-50/80 dark:from-[#161b22] dark:to-blue-900/20 border-blue-200/60 dark:border-blue-500/30 shadow-lg shadow-blue-500/10' 
                : 'bg-white/70 dark:bg-[#161b22]/70 border-gray-200/60 dark:border-white/10 hover:border-blue-300/60 dark:hover:border-blue-500/40 hover:shadow-blue-500/10'
              }
            `}
          >
            {/* Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            {/* Owned Badge Indicator - Glowing */}
            {isOwned && (
               <div className="absolute top-4 right-4 z-10">
                 <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-green-500/30 animate-pulse-slow ring-2 ring-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 </div>
               </div>
            )}

            {/* Icon Section */}
            <div className="flex items-start justify-between mb-6">
              <div className={`
                text-5xl p-5 rounded-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 shadow-sm
                ${isOwned 
                    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-white/10 dark:to-white/5 shadow-inner ring-1 ring-black/5 dark:ring-white/10' 
                    : 'bg-gray-100/50 dark:bg-white/5 grayscale-[0.5] group-hover:grayscale-0 ring-1 ring-black/5 dark:ring-white/5'
                }
              `}>
                {badge.icon}
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1 flex flex-col relative z-10">
                <div className="mb-3 flex items-center gap-2">
                     {badge.rarity && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border shadow-sm ${
                            badge.rarity === 'Legendary' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30' : 
                            badge.rarity === 'Rare' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30' : 
                            'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'
                        }`}>
                            {badge.rarity}
                        </span>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {badge.name}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-5 font-medium">
                    {badge.description}
                </p>

                {/* Tiers Visualization */}
                {badge.tiers && (
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-1.5">
                            {badge.tiers.slice(0, 4).map((tier, i) => (
                                <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden relative" title={tier}>
                                    <div className={`absolute inset-0 bg-blue-500 opacity-${(i+2)*20} group-hover:bg-blue-400 transition-colors`}></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                            <span>Base</span>
                            <span>Max</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Click Hint Tooltip on Hover */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-blue-500 dark:text-blue-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default BadgeList;