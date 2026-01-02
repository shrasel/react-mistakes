import React from 'react';

const Sidebar = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 'memoization', title: '1. Memoization vs. Colocation', icon: '🎯' },
    { id: 'fearing-rerenders', title: '2. Fearing Re-renders', icon: '⚡' },
    { id: 'context-misuse', title: '3. Context Misuse', icon: '🌐' },
    { id: 'index-as-key', title: '4. Index as Key', icon: '🔑' },
    { id: 'useeffect-redundancy', title: '5. useEffect Redundancy', icon: '♻️' },
  ];

  return (
    <div className="w-72 bg-slate-50 border-r border-slate-200 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2 text-slate-900 tracking-tight">
            React Misconceptions
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Learn from common mistakes
          </p>
        </div>

        <nav className="space-y-1.5">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`w-full text-left px-4 py-3.5 rounded-lg transition-all duration-150 flex items-center gap-3 group ${
                currentPage === page.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-xl opacity-80">{page.icon}</span>
              <span className="flex-1 text-sm font-medium leading-tight">{page.title}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-5 bg-slate-100 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold mb-2.5 text-slate-900 uppercase tracking-wider">
            💡 Learning Guide
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Each page demonstrates a common misconception with a{' '}
            <span className="text-rose-600 font-semibold">Bad Implementation</span> and a{' '}
            <span className="text-emerald-600 font-semibold">Good Implementation</span>.
            Toggle between them to understand the difference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
