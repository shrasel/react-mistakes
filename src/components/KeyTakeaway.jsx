import React from 'react';

const KeyTakeaway = ({ children }) => {
  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
        <span className="text-xl">📚</span> Key Takeaway
      </h3>
      <div className="text-slate-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};

export default KeyTakeaway;
