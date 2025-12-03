import React, { useState, useEffect, useMemo } from 'react';
import BadgeList from './components/BadgeList';
import AiSidepanel from './components/AiSidepanel';
import BadgeDetailView from './components/BadgeDetailView';
import { BADGES } from './constants';
import { Badge } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'earnable' | 'highlight' | 'retired' | 'guide'>('earnable');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // New States for Sorting/Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'name' | 'rarity'>('default');
  const [filterOption, setFilterOption] = useState<'all' | 'owned' | 'unowned'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'Common' | 'Rare' | 'Legendary'>('all');
  const [ownedBadges, setOwnedBadges] = useState<Set<string>>(new Set());
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Initialize Theme and Owned Badges
  useEffect(() => {
    // Theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // Owned Badges
    const saved = localStorage.getItem('ownedBadges');
    if (saved) {
      setOwnedBadges(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    }
  };

  const toggleOwnership = (badgeId: string) => {
    const newOwned = new Set(ownedBadges);
    if (newOwned.has(badgeId)) {
      newOwned.delete(badgeId);
    } else {
      newOwned.add(badgeId);
    }
    setOwnedBadges(newOwned);
    localStorage.setItem('ownedBadges', JSON.stringify(Array.from(newOwned)));
  };

  const filteredAndSortedBadges = useMemo(() => {
    let result = BADGES.filter(b => b.category === activeTab);
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q)
      );
    }

    // Ownership Filter
    if (filterOption === 'owned') {
      result = result.filter(b => ownedBadges.has(b.id));
    } else if (filterOption === 'unowned') {
      result = result.filter(b => !ownedBadges.has(b.id));
    }

    // Rarity Filter
    if (rarityFilter !== 'all') {
      result = result.filter(b => b.rarity === rarityFilter);
    }

    // Sort
    if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'rarity') {
      const rarityValue = { 'Common': 1, 'Rare': 2, 'Legendary': 3, undefined: 0 };
      result.sort((a, b) => (rarityValue[b.rarity || 'Common'] || 0) - (rarityValue[a.rarity || 'Common'] || 0));
    }

    return result;
  }, [activeTab, searchQuery, filterOption, rarityFilter, sortOption, ownedBadges]);

  return (
    <div className="flex h-screen overflow-hidden selection:bg-blue-500/30 selection:text-blue-200 font-sans">
      
      {/* Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gray-50 dark:bg-[#05070a] transition-colors duration-1000">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-300/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" style={{ animationDelay: '4s' }}></div>
        <div className="absolute -bottom-[30%] left-[10%] w-[80vw] h-[80vw] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" style={{ animationDelay: '8s' }}></div>
        {/* Subtle Noise Texture for Premium Feel */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Header */}
        <header className="glass border-b border-gray-200/40 dark:border-white/5 p-5 sticky top-0 z-30 flex justify-between items-center shadow-sm dark:shadow-none transition-all duration-300 backdrop-blur-xl">
          <div className="flex items-center gap-5">
             <div className="relative group cursor-pointer" onClick={() => setSelectedBadge(null)}>
               <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative w-11 h-11 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white rounded-full flex items-center justify-center font-display font-bold text-xl transition-transform duration-300 group-hover:scale-105 shadow-xl border border-gray-100 dark:border-white/10 group-hover:border-blue-500/30">
                 G
               </div>
             </div>
             <div className="hidden md:block">
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">GitHub Achievements</h1>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">The definitive profile guide</p>
             </div>
             
             {/* Header Search Bar */}
             <div className="ml-8 relative group w-full md:w-auto transition-all duration-300 hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input 
                  type="text"
                  placeholder="Search badges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-40 md:w-64 pl-10 pr-4 py-2 bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#161b22] transition-all duration-300 hover:bg-white dark:hover:bg-white/10"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors focus:outline-none"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>
            <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg active:scale-95 ${
                 isSidebarOpen 
                 ? 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700' 
                 : 'bg-white dark:bg-white/10 text-gray-700 dark:text-white border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/20'
               }`}
            >
              {isSidebarOpen ? 'Close Assistant' : 'Open Assistant'}
            </button>
          </div>
        </header>

        {/* Navigation Tabs (Only show in List view) */}
        {!selectedBadge && (
            <div className="px-6 md:px-8 pt-8 pb-4 animate-fade-in">
                <nav className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex bg-white/40 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5 backdrop-blur-md shadow-sm overflow-x-auto no-scrollbar max-w-full">
                        {(['earnable', 'highlight', 'retired', 'guide'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSelectedBadge(null); }}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                activeTab === tab 
                                ? 'bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-md ring-1 ring-black/5 dark:ring-white/10' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab !== 'guide' ? 'Badges' : ''}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 scroll-smooth z-10">
           <div className="max-w-7xl mx-auto min-h-full">
              
              {selectedBadge ? (
                 /* Detail View */
                 <BadgeDetailView 
                    badge={selectedBadge} 
                    isOwned={ownedBadges.has(selectedBadge.id)}
                    onToggleOwn={() => toggleOwnership(selectedBadge.id)}
                    onBack={() => setSelectedBadge(null)}
                 />
              ) : (
                 /* List/Gallery View */
                 <div className="animate-fade-in">
                    {activeTab === 'guide' ? (
                        <div className="space-y-8 max-w-4xl mx-auto mt-4">
                            {/* Guide Content remains same but wrapped in same layout */}
                            <div className="glass-panel rounded-3xl p-10 shadow-xl border-0 ring-1 ring-white/20 hover:shadow-2xl transition-all duration-500">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">How to Earn Specific Achievements</h2>
                                <div className="space-y-10">
                                    <div className="group">
                                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-4">
                                            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-2xl shadow-inner ring-1 ring-blue-500/30">⚡</span> 
                                            Quickdraw
                                        </h3>
                                        <div className="pl-16">
                                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed font-light">The goal is to close an issue or PR within 5 minutes of opening it.</p>
                                            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-400 bg-gray-50/50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-sm">
                                                <li>Create a new public repository.</li>
                                                <li>Create an issue titled "Test Issue".</li>
                                                <li>Immediately click the "Close issue" button.</li>
                                                <li>Wait up to 24 hours for the badge to appear.</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
                                    <div className="group">
                                        <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-4">
                                            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-2xl shadow-inner ring-1 ring-purple-500/30">🦈</span> 
                                            Pull Shark
                                        </h3>
                                        <div className="pl-16">
                                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed font-light">Awarded for having pull requests merged. This has tiers starting at 2 PRs.</p>
                                            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-400 bg-gray-50/50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-sm">
                                                <li>Find a repository you want to contribute to (or create your own).</li>
                                                <li>Create a branch, make changes, and push.</li>
                                                <li>Open a Pull Request.</li>
                                                <li>Merge the Pull Request.</li>
                                                <li>Repeat to level up to Bronze, Silver, and Gold.</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* FAQ Section */}
                            <div className="glass-panel rounded-3xl p-10 shadow-xl border-0 ring-1 ring-white/20 hover:shadow-2xl transition-all duration-500">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    <details className="group p-5 bg-white/40 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 open:bg-white dark:open:bg-white/10 transition-all duration-300">
                                        <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-gray-800 dark:text-gray-200 text-lg">
                                            <span>Can I hide achievements?</span>
                                            <span className="transition-transform duration-300 group-open:rotate-180 bg-gray-200 dark:bg-white/10 rounded-full p-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </span>
                                        </summary>
                                        <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed pl-1 animate-fadeIn">
                                            Yes, you can manage the visibility of your achievements in your profile settings. You can choose to show all, some, or none.
                                        </p>
                                    </details>
                                    <details className="group p-5 bg-white/40 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 open:bg-white dark:open:bg-white/10 transition-all duration-300">
                                        <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-gray-800 dark:text-gray-200 text-lg">
                                            <span>How often are badges updated?</span>
                                            <span className="transition-transform duration-300 group-open:rotate-180 bg-gray-200 dark:bg-white/10 rounded-full p-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </span>
                                        </summary>
                                        <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed pl-1 animate-fadeIn">
                                            Badges are typically updated within 24 hours of completing the requirement. Sometimes it may be instant, but caching can cause delays.
                                        </p>
                                    </details>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Toolbar for Sort/Filter */}
                            <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                                        {activeTab === 'earnable' ? 'Earnable Achievements' : 
                                        activeTab === 'highlight' ? 'Profile Highlights' : 'Retired Badges'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl">
                                        {activeTab === 'earnable' ? 'These badges are automatically awarded for specific public activities. Collect them all to showcase your contributions.' :
                                        activeTab === 'highlight' ? 'Badges representing specific status, memberships, or program participation.' :
                                        'Historical badges that are part of GitHub history but no longer obtainable.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Sort Dropdown */}
                                    <div className="relative group">
                                        <select 
                                            value={sortOption} 
                                            onChange={(e) => setSortOption(e.target.value as any)}
                                            className="appearance-none bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            <option value="default">Sort by Default</option>
                                            <option value="name">Sort by Name</option>
                                            <option value="rarity">Sort by Rarity</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>

                                    {/* Ownership Filter Dropdown */}
                                    <div className="relative group">
                                        <select 
                                            value={filterOption} 
                                            onChange={(e) => setFilterOption(e.target.value as any)}
                                            className="appearance-none bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            <option value="all">Status: All</option>
                                            <option value="owned">Owned</option>
                                            <option value="unowned">Unowned</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>

                                    {/* Rarity Filter Dropdown */}
                                    <div className="relative group">
                                        <select 
                                            value={rarityFilter} 
                                            onChange={(e) => setRarityFilter(e.target.value as any)}
                                            className="appearance-none bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            <option value="all">Rarity: All</option>
                                            <option value="Common">Common</option>
                                            <option value="Rare">Rare</option>
                                            <option value="Legendary">Legendary</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <BadgeList 
                                badges={filteredAndSortedBadges} 
                                ownedIds={ownedBadges}
                                onBadgeClick={(badge) => setSelectedBadge(badge)}
                            />
                        </>
                    )}
                 </div>
              )}
              
              {!selectedBadge && (
                <footer className="mt-20 mb-10 text-center text-sm text-gray-400 dark:text-gray-500 border-t border-gray-200/50 dark:border-white/5 pt-10 backdrop-blur-sm">
                    <p className="font-medium text-base">Designed with <span className="text-red-500 animate-pulse">❤</span> for the Community</p>
                </footer>
              )}
           </div>
        </main>
      </div>

      {/* Right Sidebar - Smart Assistant */}
      <div 
        className={`fixed inset-y-0 right-0 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-40 shadow-2xl dark:shadow-black/50 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <AiSidepanel />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
      )}
    </div>
  );
};

export default App;