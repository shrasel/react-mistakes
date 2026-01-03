import React, { useState, useMemo } from 'react';

/**
 * MISCONCEPTION #2: Fearing Re-renders
 * 
 * Developers often think re-renders are inherently bad and try to prevent them.
 * In reality, React's reconciliation is fast. The real problem is usually
 * expensive calculations running on every render, NOT the render itself.
 */

// Generate a large dataset
const generateItems = (count = 5000) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 1000,
    category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
  }));
};

const ITEMS = generateItems(5000);

// ❌ BAD: Expensive calculation in render body without memoization
const BadImplementation = () => {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('ALL');
  const [renderCount, setRenderCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // ❌ BAD: This expensive calculation runs on EVERY render
  // Even when unrelatedState changes (which has nothing to do with the list)
  React.useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 100);
    return () => clearTimeout(timer);
  }, [renderCount]);

  const startTime = performance.now();
  
  const filteredItems = ITEMS.filter(item => {
    const matchesFilter = item.name.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'ALL' || item.category === category;
    return matchesFilter && matchesCategory;
  }).sort((a, b) => b.value - a.value);
  
  const calculationTime = (performance.now() - startTime).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 relative">
        {isCalculating && (
          <div className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            🔄 Calculating...
          </div>
        )}
        <h3 className="text-xl font-bold text-red-800 mb-4">
          ❌ Bad Implementation: Fearing Re-renders
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by name:
            </label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Type to filter..."
              className="w-full px-4 py-2 border border-red-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-red-300 rounded-lg"
            >
              <option value="ALL">All Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
              <option value="D">Category D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unrelated counter:
            </label>
            <button
              onClick={() => setUnrelatedState(prev => prev + 1)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Click Me: {unrelatedState}
            </button>
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-800">{renderCount}</div>
              <div className="text-xs text-red-700">Total Renders</div>
              <div className="text-xs text-red-600 font-semibold mt-1">= Calculations 😱</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-800">{calculationTime}ms</div>
              <div className="text-xs text-red-700">Last Calculation</div>
              <div className="text-xs text-red-600 font-semibold mt-1">Every Time!</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-800">{filteredItems.length}</div>
              <div className="text-xs text-red-700">Filtered Items</div>
              <div className="text-xs text-red-600 font-semibold mt-1">of 5,000 total</div>
            </div>
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-red-800">
            <strong>⚠️ The Problem:</strong> The filtering/sorting calculation runs on{' '}
            <strong>EVERY</strong> render, even when you click the unrelated counter button.
            Try clicking the counter - notice the lag? That's because we're re-filtering
            and re-sorting 5,000 items unnecessarily.
          </p>
          <p className="text-sm text-red-800 mt-2">
            <strong>The Misconception:</strong> "Re-renders are slow, I need to prevent them!"
            Actually, the re-render itself is fast. The slow part is recalculating this
            filtered/sorted array every time.
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto border border-red-300 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-red-200 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.slice(0, 50).map(item => (
                <tr key={item.id} className="border-t border-red-200">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2 text-right">{item.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-red-600 mt-2">
          Showing first 50 of {filteredItems.length} items
        </p>
      </div>
    </div>
  );
};

// ✅ GOOD: Use useMemo to cache expensive calculations
const GoodImplementation = () => {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('ALL');
  const [renderCount, setRenderCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(0);
  const [calculationCount, setCalculationCount] = useState(0);
  const [lastCalculationTime, setLastCalculationTime] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // ✅ GOOD: Memoize the expensive calculation
  // This only recalculates when filter or category changes
  const filteredItems = useMemo(() => {
    setIsCalculating(true);
    const startTime = performance.now();
    setCalculationCount(prev => prev + 1);
    
    const result = ITEMS.filter(item => {
      const matchesFilter = item.name.toLowerCase().includes(filter.toLowerCase());
      const matchesCategory = category === 'ALL' || item.category === category;
      return matchesFilter && matchesCategory;
    }).sort((a, b) => b.value - a.value);
    
    const calculationTime = performance.now() - startTime;
    setLastCalculationTime(calculationTime.toFixed(2));
    setTimeout(() => setIsCalculating(false), 100);
    
    return result;
  }, [filter, category]); // Only recalculate when these dependencies change

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 relative">
        {isCalculating && (
          <div className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
            🔄 Calculating (memoized)...
          </div>
        )}
        <h3 className="text-xl font-bold text-green-800 mb-4">
          ✅ Good Implementation: useMemo for Expensive Calculations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by name:
            </label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Type to filter..."
              className="w-full px-4 py-2 border border-green-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 rounded-lg"
            >
              <option value="ALL">All Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
              <option value="D">Category D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unrelated counter:
            </label>
            <button
              onClick={() => setUnrelatedState(prev => prev + 1)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Click Me: {unrelatedState}
            </button>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-800">{renderCount}</div>
              <div className="text-xs text-green-700">Total Renders</div>
              <div className="text-xs text-green-600 font-semibold mt-1">No problem! ✅</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">{calculationCount}</div>
              <div className="text-xs text-green-700">Calculations</div>
              <div className="text-xs text-green-600 font-semibold mt-1">Only when needed!</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">{lastCalculationTime}ms</div>
              <div className="text-xs text-green-700">Last Calc Time</div>
              <div className="text-xs text-green-600 font-semibold mt-1">Cached result</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">{filteredItems.length}</div>
              <div className="text-xs text-green-700">Filtered Items</div>
              <div className="text-xs text-green-600 font-semibold mt-1">of 5,000 total</div>
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-green-800">
            <strong>✅ The Solution:</strong> We wrapped the expensive calculation in{' '}
            <code className="bg-green-200 px-1 rounded">useMemo</code>. Now it only recalculates
            when <code className="bg-green-200 px-1 rounded">filter</code> or{' '}
            <code className="bg-green-200 px-1 rounded">category</code> changes.
          </p>
          <p className="text-sm text-green-800 mt-2">
            <strong>Notice:</strong> Click the counter button - it's instant! The component
            re-renders (Render count increases), but the expensive calculation doesn't run
            (Calculations count stays the same). React's render is fast; expensive logic is not.
          </p>
          <p className="text-sm text-green-800 mt-2">
            <strong>Key Insight:</strong> Don't fear re-renders. Fear expensive calculations
            running unnecessarily. Use <code className="bg-green-200 px-1 rounded">useMemo</code>
            to cache results of expensive operations.
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto border border-green-300 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-green-200 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.slice(0, 50).map(item => (
                <tr key={item.id} className="border-t border-green-200">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2 text-right">{item.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-green-600 mt-2">
          Showing first 50 of {filteredItems.length} items
        </p>
      </div>
    </div>
  );
};

// Main page component
const FearingReRenders = () => {
  const [showGood, setShowGood] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Misconception #2: Fearing Re-renders
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Re-renders aren't the enemy. Expensive calculations running on every render are.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setShowGood(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showGood
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ❌ Bad Implementation
          </button>
          <button
            onClick={() => setShowGood(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showGood
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✅ Good Implementation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {!showGood ? <BadImplementation /> : <GoodImplementation />}
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          📚 Key Takeaway
        </h3>
        <p className="text-blue-800">
          React's reconciliation (diffing virtual DOM and updating real DOM) is highly optimized.
          A component can re-render hundreds of times per second without issues. The real
          performance bottleneck is usually expensive calculations, API calls, or DOM
          manipulations. Use <code className="bg-blue-100 px-1 rounded">useMemo</code> to cache
          expensive calculations, not to prevent re-renders.
        </p>
      </div>
    </div>
  );
};

export default FearingReRenders;
