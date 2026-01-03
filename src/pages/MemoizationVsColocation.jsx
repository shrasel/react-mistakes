import React, { useState, memo } from 'react';
import PageHeader from '../components/PageHeader';
import KeyTakeaway from '../components/KeyTakeaway';

/**
 * MISCONCEPTION #1: Memoization vs. Colocation
 * 
 * Many developers reach for React.memo too quickly when they experience
 * performance issues, without understanding the root cause.
 */

// Simulate an expensive component that takes time to render
const ExpensiveComponent = memo(({ renderCount }) => {
  const [isRendering, setIsRendering] = useState(false);
  
  // Simulate expensive computation (BAD: this shouldn't be necessary!)
  React.useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => setIsRendering(false), 150);
    return () => clearTimeout(timer);
  }, [renderCount]);

  let startTime = performance.now();
  while (performance.now() - startTime < 100) {
    // Artificial delay - simulates slow component
  }

  return (
    <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl relative overflow-hidden">
      {isRendering && (
        <div className="absolute inset-0 bg-amber-200/50 animate-pulse flex items-center justify-center">
          <span className="text-amber-900 font-bold">⏳ Rendering...</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-amber-900 mb-2">
        💤 Slow Component (wrapped in memo)
      </h3>
      <p className="text-amber-800 text-sm">
        Render count: <span className="font-bold">{renderCount}</span>
      </p>
      <p className="text-xs text-amber-700 mt-2">
        This component has artificial lag (~100ms)
      </p>
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

// ❌ BAD: Input state causes entire parent to re-render
const BadImplementation = () => {
  const [inputValue, setInputValue] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(0);

  // This runs on every render, including when typing
  React.useEffect(() => {
    const now = Date.now();
    if (renderCount > 0) {
      setLastRenderTime(now);
    }
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-rose-200 rounded-xl p-6 relative">
        {lastRenderTime > 0 && Date.now() - lastRenderTime < 200 && (
          <div className="absolute top-2 right-2 px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse">
            🔄 Parent Re-rendering
          </div>
        )}
        <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
          <span>❌</span> Bad Implementation: memo as a Band-Aid
        </h3>
        
        <div className="bg-rose-100 border border-rose-200 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-rose-800">{renderCount}</div>
              <div className="text-xs text-rose-700">Parent Renders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-800">{inputValue.length}</div>
              <div className="text-xs text-rose-700">Characters Typed</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type here (notice the lag):
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Start typing..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Value: {inputValue || '(empty)'}
            </p>
          </div>

          <ExpensiveComponent renderCount={renderCount} />

          <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl">
            <p className="text-sm text-rose-900 mb-2">
              <strong className="font-semibold">⚠️ The Problem:</strong> The input state lives in the parent component.
              Every keystroke causes the parent to re-render. Even though we wrapped the
              expensive component in <code className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-mono text-xs">React.memo</code>,
              the parent still re-renders, causing noticeable lag when typing.
            </p>
            <p className="text-sm text-rose-900">
              <strong className="font-semibold">Why memo isn't enough:</strong> memo prevents the <em>child</em> from
              re-rendering, but the parent (where the input lives) still re-renders on every
              keystroke, creating the lag you feel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ GOOD: State Colocation - Move state closer to where it's used
const InputComponent = () => {
  // State is now isolated in this component
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Type here (smooth & fast):
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Start typing..."
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
      />
      <p className="text-xs text-slate-500 mt-1.5">
        Value: {inputValue || '(empty)'}
      </p>
    </div>
  );
};

const SlowComponentWithoutMemo = ({ renderCount }) => {
  const [isRendering, setIsRendering] = useState(false);
  
  React.useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => setIsRendering(false), 150);
    return () => clearTimeout(timer);
  }, [renderCount]);

  // Same expensive computation, but no memo needed!
  let startTime = performance.now();
  while (performance.now() - startTime < 100) {
    // Artificial delay
  }

  return (
    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl relative overflow-hidden">
      {isRendering && (
        <div className="absolute inset-0 bg-emerald-200/50 animate-pulse flex items-center justify-center">
          <span className="text-emerald-900 font-bold">⏳ Rendering...</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-emerald-900 mb-2">
        💤 Slow Component (NO memo needed!)
      </h3>
      <p className="text-emerald-800 text-sm">
        Render count: <span className="font-bold">{renderCount}</span>
      </p>
      <p className="text-xs text-emerald-700 mt-2">
        This component has the same lag, but doesn't re-render unnecessarily
      </p>
    </div>
  );
};

const GoodImplementation = () => {
  const [renderCount, setRenderCount] = useState(0);

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-emerald-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <span>✅</span> Good Implementation: State Colocation
        </h3>
        
        <div className="space-y-4">
          {/* Input is now in its own component */}
          <InputComponent />

          {/* Slow component doesn't need memo because parent rarely re-renders */}
          <SlowComponentWithoutMemo renderCount={renderCount} />

          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
            <p className="text-sm text-emerald-900 mb-2">
              <strong className="font-semibold">✅ The Solution:</strong> We moved the input state into its own component
              (<code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono text-xs">InputComponent</code>). Now when you
              type, only that small component re-renders. The parent and slow component stay
              completely stable.
            </p>
            <p className="text-sm text-emerald-900 mb-2">
              <strong className="font-semibold">Key Principle:</strong> "State Colocation" - Keep state as close as possible
              to where it's used. This prevents unnecessary re-renders in unrelated parts of your
              component tree. No memo needed!
            </p>
            <p className="text-sm text-emerald-900">
              <strong className="font-semibold">When to use memo:</strong> Use it when a component receives the same props
              but re-renders due to its parent's state changes. But first, try moving state down.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with toggle
const MemoizationVsColocation = () => {
  const [showGood, setShowGood] = useState(false);

  return (
    <div>
      <PageHeader
        title="Misconception #1: Memoization vs. Colocation"
        description={
          <>
            Don't reach for <code className="bg-slate-100 text-slate-900 px-2 py-1 rounded font-mono text-sm">React.memo</code> first.
            Consider restructuring your components instead.
          </>
        }
        showGood={showGood}
        onToggle={setShowGood}
      />

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
        {!showGood ? <BadImplementation /> : <GoodImplementation />}
      </div>

      <KeyTakeaway>
        <p>
          Before adding <code className="bg-slate-800 text-slate-100 px-2 py-0.5 rounded font-mono text-sm">React.memo</code>, ask yourself:
          "Can I move this state closer to where it's actually used?" State colocation is often
          a better solution than memoization. It makes your code simpler, easier to understand,
          and naturally prevents unnecessary re-renders.
        </p>
      </KeyTakeaway>
    </div>
  );
};

export default MemoizationVsColocation;
