import React, { useState, useEffect } from 'react';

/**
 * MISCONCEPTION #5: useEffect Redundancy
 * 
 * Developers often use useEffect + useState to derive values from props or other state,
 * not realizing this causes unnecessary re-renders and complexity.
 * Most values can be calculated directly during render.
 */

// ❌ BAD: Using useEffect to sync derived state
const BadUserCard = ({ firstName, lastName, email }) => {
  const [fullName, setFullName] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  const [effectRunCount, setEffectRunCount] = useState(0);

  // Track renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // ❌ BAD: Using useEffect to calculate a derived value
  // This causes TWO renders every time firstName or lastName changes:
  // 1. Initial render with old fullName
  // 2. Effect runs and updates fullName, triggering another render
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
    setEffectRunCount(prev => prev + 1);
  }, [firstName, lastName]);

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
      <h3 className="text-xl font-bold text-red-800 mb-4">
        👤 User Card (Bad Version)
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 w-24">Full Name:</span>
          <span className="text-lg font-bold text-gray-900">{fullName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 w-24">Email:</span>
          <span className="text-gray-900">{email}</span>
        </div>
      </div>

      <div className="bg-red-100 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center mb-3">
          <div>
            <div className="text-2xl font-bold text-red-800">{renderCount}</div>
            <div className="text-xs text-red-700">Render Count</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-800">{effectRunCount}</div>
            <div className="text-xs text-red-700">Effect Runs</div>
          </div>
        </div>
        <p className="text-xs text-red-800">
          <strong>⚠️ Problem:</strong> Notice how the render count is higher than the effect count?
          That's because of the "flash" - the component renders with empty fullName first,
          then the effect runs and triggers another render with the correct value.
        </p>
      </div>
    </div>
  );
};

const BadImplementation = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email] = useState('john.doe@example.com');

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          ❌ Bad Implementation: useEffect for Derived State
        </h3>

        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-red-800 mb-2">
            <strong>⚠️ The Problem:</strong> We use{' '}
            <code className="bg-red-200 px-1 rounded">useEffect</code> to calculate{' '}
            <code className="bg-red-200 px-1 rounded">fullName</code> from{' '}
            <code className="bg-red-200 px-1 rounded">firstName</code> and{' '}
            <code className="bg-red-200 px-1 rounded">lastName</code>.
          </p>
          <p className="text-sm text-red-800 mb-2">
            <strong>What happens:</strong>
          </p>
          <ol className="text-sm text-red-800 list-decimal list-inside space-y-1 mb-2">
            <li>Props change (firstName or lastName updates)</li>
            <li>Component renders with OLD fullName value</li>
            <li>Effect runs and calls setFullName()</li>
            <li>Component renders AGAIN with new fullName value</li>
          </ol>
          <p className="text-sm text-red-800">
            This causes unnecessary double renders and can lead to UI "flashes" where the
            wrong value appears briefly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-red-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-red-300 rounded-lg"
            />
          </div>
        </div>

        <BadUserCard firstName={firstName} lastName={lastName} email={email} />
      </div>
    </div>
  );
};

// ✅ GOOD: Calculate derived value directly during render
const GoodUserCard = ({ firstName, lastName, email }) => {
  const [renderCount, setRenderCount] = useState(0);

  // Track renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // ✅ GOOD: Calculate derived value directly
  // No useState, no useEffect needed!
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        👤 User Card (Good Version)
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 w-24">Full Name:</span>
          <span className="text-lg font-bold text-gray-900">{fullName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 w-24">Email:</span>
          <span className="text-gray-900">{email}</span>
        </div>
      </div>

      <div className="bg-green-100 p-4 rounded-lg">
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-green-800">{renderCount}</div>
          <div className="text-xs text-green-700">Render Count</div>
        </div>
        <p className="text-xs text-green-800">
          <strong>✅ Perfect:</strong> The component only renders once per prop change.
          No extra renders, no useEffect complexity, and the value is always correct
          immediately.
        </p>
      </div>
    </div>
  );
};

const GoodImplementation = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email] = useState('john.doe@example.com');

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">
          ✅ Good Implementation: Derived State During Render
        </h3>

        <div className="bg-green-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-green-800 mb-2">
            <strong>✅ The Solution:</strong> Calculate{' '}
            <code className="bg-green-200 px-1 rounded">fullName</code> directly in the
            render body with a simple variable. No useState or useEffect needed!
          </p>
          <p className="text-sm text-green-800 mb-2">
            <strong>Benefits:</strong>
          </p>
          <ul className="text-sm text-green-800 list-disc list-inside space-y-1 mb-2">
            <li>Only one render per change (no double render)</li>
            <li>Value is always in sync - no possibility of stale state</li>
            <li>Simpler code - less to maintain and debug</li>
            <li>Better performance - fewer renders and state updates</li>
          </ul>
          <p className="text-sm text-green-800">
            <strong>Rule of thumb:</strong> If you can calculate a value from props or other
            state, do it during render. Don't use useEffect to sync derived state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 rounded-lg"
            />
          </div>
        </div>

        <GoodUserCard firstName={firstName} lastName={lastName} email={email} />
      </div>
    </div>
  );
};

// Main page component
const UseEffectRedundancy = () => {
  const [showGood, setShowGood] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Misconception #5: useEffect Redundancy
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Don't use <code className="bg-gray-200 px-2 py-1 rounded text-sm">useEffect</code> to
          calculate values that can be derived during render.
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
        <p className="text-blue-800 mb-2">
          <code className="bg-blue-100 px-1 rounded">useEffect</code> is for{' '}
          <strong>synchronizing with external systems</strong> (APIs, DOM, subscriptions),
          not for deriving values from props or state.
        </p>
        <p className="text-blue-800 mb-2">
          <strong>When to use useEffect:</strong> Fetching data, setting up subscriptions,
          manually manipulating the DOM, logging analytics.
        </p>
        <p className="text-blue-800">
          <strong>When NOT to use useEffect:</strong> Calculating derived state, transforming data,
          formatting values. Do these directly during render for better performance and simpler code.
        </p>
      </div>
    </div>
  );
};

export default UseEffectRedundancy;
