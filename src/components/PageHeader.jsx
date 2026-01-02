import React from 'react';

const PageHeader = ({ title, description, showGood, onToggle }) => {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
        {title}
      </h1>
      <p className="text-lg text-slate-600 mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle(false)}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${
            !showGood
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ❌ Bad Implementation
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${
            showGood
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ✅ Good Implementation
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
