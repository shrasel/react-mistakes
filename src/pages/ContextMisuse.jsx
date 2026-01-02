import React, { useState, createContext, useContext, useEffect } from 'react';

/**
 * MISCONCEPTION #3: Context Misuse
 * 
 * Developers often create a single "God Context" that holds all global state.
 * When any value in that context changes, ALL consumers re-render, even if
 * they only use a specific piece of that context.
 */

// ❌ BAD: Single context with multiple values that change at different frequencies
const BadGlobalContext = createContext();

const BadGlobalProvider = ({ children }) => {
  const [user] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BadGlobalContext.Provider value={{ user, currentTime }}>
      {children}
    </BadGlobalContext.Provider>
  );
};

// Component that only needs user data
const BadUserProfile = () => {
  const { user } = useContext(BadGlobalContext);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
      <h3 className="text-lg font-bold text-red-800 mb-3">
        👤 User Profile Component
      </h3>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-sm">
          <strong>Email:</strong> {user.email}
        </p>
        <div className="mt-4 p-3 bg-red-100 rounded">
          <p className="text-xs text-red-800">
            <strong>⚠️ Render Count:</strong>{' '}
            <span className="text-2xl font-bold">{renderCount}</span>
          </p>
          <p className="text-xs text-red-700 mt-1">
            This component only needs user data (which never changes),
            but it re-renders every second because currentTime is in the same context!
          </p>
        </div>
      </div>
    </div>
  );
};

// Component that needs the current time
const BadClockDisplay = () => {
  const { currentTime } = useContext(BadGlobalContext);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
      <h3 className="text-lg font-bold text-yellow-800 mb-3">
        🕐 Clock Component
      </h3>
      <div className="text-3xl font-mono font-bold text-yellow-900 mb-4">
        {currentTime}
      </div>
      <div className="p-3 bg-yellow-100 rounded">
        <p className="text-xs text-yellow-800">
          <strong>Render Count:</strong>{' '}
          <span className="text-xl font-bold">{renderCount}</span>
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          This component SHOULD re-render every second (expected behavior)
        </p>
      </div>
    </div>
  );
};

const BadImplementation = () => {
  return (
    <BadGlobalProvider>
      <div className="space-y-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-4">
            ❌ Bad Implementation: God Context
          </h3>

          <div className="bg-red-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-red-800">
              <strong>⚠️ The Problem:</strong> Both <code className="bg-red-200 px-1 rounded">user</code>
              {' '}(static) and <code className="bg-red-200 px-1 rounded">currentTime</code> (updates every second)
              are in the same context. Even though the User Profile component only uses{' '}
              <code className="bg-red-200 px-1 rounded">user</code>, it re-renders every second
              because the context value changes.
            </p>
            <p className="text-sm text-red-800 mt-2">
              <strong>Why it happens:</strong> When ANY value in a context changes, React considers
              the entire context value as changed, causing ALL consumers to re-render.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BadUserProfile />
            <BadClockDisplay />
          </div>
        </div>
      </div>
    </BadGlobalProvider>
  );
};

// ✅ GOOD: Split contexts by update frequency
const UserContext = createContext();
const TimeContext = createContext();

const GoodUserProvider = ({ children }) => {
  const [user] = useState({ name: 'John Doe', email: 'john@example.com' });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

const GoodTimeProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimeContext.Provider value={currentTime}>
      {children}
    </TimeContext.Provider>
  );
};

// Component that only needs user data - now stable!
const GoodUserProfile = () => {
  const user = useContext(UserContext);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
      <h3 className="text-lg font-bold text-green-800 mb-3">
        👤 User Profile Component
      </h3>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-sm">
          <strong>Email:</strong> {user.email}
        </p>
        <div className="mt-4 p-3 bg-green-100 rounded">
          <p className="text-xs text-green-800">
            <strong>✅ Render Count:</strong>{' '}
            <span className="text-2xl font-bold">{renderCount}</span>
          </p>
          <p className="text-xs text-green-700 mt-1">
            This component only subscribes to UserContext, so it only renders once!
            The time updates don't affect it at all.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component that needs the current time
const GoodClockDisplay = () => {
  const currentTime = useContext(TimeContext);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
      <h3 className="text-lg font-bold text-green-800 mb-3">
        🕐 Clock Component
      </h3>
      <div className="text-3xl font-mono font-bold text-green-900 mb-4">
        {currentTime}
      </div>
      <div className="p-3 bg-green-100 rounded">
        <p className="text-xs text-green-800">
          <strong>Render Count:</strong>{' '}
          <span className="text-xl font-bold">{renderCount}</span>
        </p>
        <p className="text-xs text-green-700 mt-1">
          This component subscribes to TimeContext and re-renders every second (as expected)
        </p>
      </div>
    </div>
  );
};

const GoodImplementation = () => {
  return (
    <GoodUserProvider>
      <GoodTimeProvider>
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              ✅ Good Implementation: Split Contexts
            </h3>

            <div className="bg-green-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800">
                <strong>✅ The Solution:</strong> We split the context into{' '}
                <code className="bg-green-200 px-1 rounded">UserContext</code> and{' '}
                <code className="bg-green-200 px-1 rounded">TimeContext</code>. Now components
                only subscribe to the data they actually need.
              </p>
              <p className="text-sm text-green-800 mt-2">
                <strong>Result:</strong> The User Profile component renders once and stays stable,
                while the Clock component updates every second. Each component is isolated from
                changes it doesn't care about.
              </p>
              <p className="text-sm text-green-800 mt-2">
                <strong>Best Practice:</strong> Split contexts by domain (user, auth, theme) and
                by update frequency (static vs. dynamic data). This prevents unnecessary re-renders
                and makes your app more performant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GoodUserProfile />
              <GoodClockDisplay />
            </div>
          </div>
        </div>
      </GoodTimeProvider>
    </GoodUserProvider>
  );
};

// Main page component
const ContextMisuse = () => {
  const [showGood, setShowGood] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Misconception #3: Context Misuse
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Don't put all your global state in one context. Split contexts by domain and update frequency.
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
          Context is not a state management solution - it's a dependency injection mechanism.
          When a context value changes, ALL consumers re-render. Split your contexts logically:
          separate static data from dynamic data, and group related data together. Consider using
          specialized state management libraries (Zustand, Jotai, Redux) for complex global state.
        </p>
      </div>
    </div>
  );
};

export default ContextMisuse;
