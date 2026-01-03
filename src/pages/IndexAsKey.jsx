import React, { useState } from 'react';

/**
 * MISCONCEPTION #4: Using Index as Key
 * 
 * Using array index as key seems convenient, and it works fine when
 * the list is static. But when items can be added, removed, or reordered,
 * using index as key causes React to misidentify components, leading to
 * bugs with component state and focus.
 */

// Generate unique IDs
let nextId = 4;
const generateId = () => nextId++;

// ❌ BAD: Using index as key
const BadImplementation = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Task 1', color: 'bg-red-100', completed: false },
    { id: 2, text: 'Task 2', color: 'bg-blue-100', completed: false },
    { id: 3, text: 'Task 3', color: 'bg-green-100', completed: false },
  ]);

  const [inputValues, setInputValues] = useState({});

  const deleteItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    const newItem = {
      id: generateId(),
      text: `Task ${generateId()}`,
      color: ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'][
        Math.floor(Math.random() * 4)
      ],
      completed: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleInputChange = (index, value) => {
    setInputValues(prev => ({ ...prev, [index]: value }));
  };

  const toggleComplete = (index) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          ❌ Bad Implementation: Index as Key
        </h3>

        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-red-800 mb-2">
            <strong>⚠️ The Problem:</strong> Each item uses its array index as the key.
            When you delete an item, React gets confused about which component is which.
          </p>
          <p className="text-sm text-red-800 mb-2">
            <strong>Try this to see the bugs:</strong>
          </p>
          <ol className="text-sm text-red-800 list-decimal list-inside space-y-1">
            <li>Check the checkbox on Task 1</li>
            <li>Type different text in each input field</li>
            <li>Delete Task 1</li>
            <li>🐞 BUG: Notice how the checkbox and input values "shift up" incorrectly!</li>
          </ol>
          <p className="text-sm text-red-800 mt-2">
            <strong>What happens:</strong> When you delete Task 1, Task 2 moves to index 0.
            React sees "key=0 still exists" and reuses that component instance, preserving
            the old state (checkbox and input) from Task 1!
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            ➕ Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            // ❌ BAD: Using index as key
            <div
              key={index}
              className={`${item.color} border-2 ${
                item.completed ? 'border-green-500' : 'border-red-300'
              } rounded-lg p-4 flex items-center gap-4 transition-all`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(index)}
                className="w-5 h-5 rounded"
              />

              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className={`font-semibold text-gray-800 mb-2 ${
                  item.completed ? 'line-through opacity-60' : ''
                }`}>
                  {item.text}
                </div>
                <input
                  type="text"
                  placeholder="Type something here..."
                  value={inputValues[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Key: <code className="bg-red-200 px-1 rounded">index={index}</code> |
                  ID: <code className="bg-red-200 px-1 rounded">{item.id}</code>
                </p>
              </div>

              <button
                onClick={() => deleteItem(index)}
                className="flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items. Click "Add Item" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ GOOD: Using unique ID as key
const GoodImplementation = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Task 1', color: 'bg-red-100', completed: false },
    { id: 2, text: 'Task 2', color: 'bg-blue-100', completed: false },
    { id: 3, text: 'Task 3', color: 'bg-green-100', completed: false },
  ]);

  const [inputValues, setInputValues] = useState({});

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    // Clean up input value for deleted item
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const addItem = () => {
    const newId = generateId();
    const newItem = {
      id: newId,
      text: `Task ${newId}`,
      color: ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'][
        Math.floor(Math.random() * 4)
      ],
      completed: false,
    };
    setItems(prev => [...prev, newItem]);
  };
      text: `Task ${newId}`,
      color: ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'][
        Math.floor(Math.random() * 4)
      ],
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleInputChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const toggleComplete = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">
          ✅ Good Implementation: Unique ID as Key
        </h3>

        <div className="bg-green-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-green-800 mb-2">
            <strong>✅ The Solution:</strong> Each item uses its unique{' '}
            <code className="bg-green-200 px-1 rounded">id</code> as the key.
            React can now correctly identify which component is which.
          </p>
          <p className="text-sm text-green-800 mb-2">
            <strong>Try this:</strong>
          </p>
          <ol className="text-sm text-green-800 list-decimal list-inside space-y-1">
            <li>Type different text in each input field</li>
            <li>Delete the first item (Task 1)</li>
            <li>Notice how the input values stay with their correct items!</li>
          </ol>
          <p className="text-sm text-green-800 mt-2">
            <strong>What happens:</strong> When you delete Task 1, React sees that{' '}
            <code className="bg-green-200 px-1 rounded">key="1"</code> is gone and{' '}
            <code className="bg-green-200 px-1 rounded">key="2"</code> and{' '}
            <code className="bg-green-200 px-1 rounded">key="3"</code> are still present.
            It correctly maintains the component instances and their state.
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ➕ Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            // ✅ GOOD: Using unique ID as key
            <div
              key={item.id}
              className={`${item.color} border-2 ${
                item.completed ? 'border-green-500' : 'border-green-300'
              } rounded-lg p-4 flex items-center gap-4 transition-all`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
                className="w-5 h-5 rounded"
              />

              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className={`font-semibold text-gray-800 mb-2 ${
                  item.completed ? 'line-through opacity-60' : ''
                }`}>
                  {item.text}
                </div>
                <input
                  type="text"
                  placeholder="Type something here..."
                  value={inputValues[item.id] || ''}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Key: <code className="bg-green-200 px-1 rounded">id={item.id}</code>
                </p>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items. Click "Add Item" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

// Main page component
const IndexAsKey = () => {
  const [showGood, setShowGood] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Misconception #4: Index as Key
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Using array index as <code className="bg-gray-200 px-2 py-1 rounded text-sm">key</code>
          {' '}causes React to lose track of component identity when the list changes.
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
          The <code className="bg-blue-100 px-1 rounded">key</code> prop helps React identify
          which items have changed, been added, or been removed. When you use index as key,
          React can't distinguish between "item at position 0" vs "the item with id=1".
        </p>
        <p className="text-blue-800 mb-2">
          <strong>When index is OK:</strong> Only use index as key if:
          1) The list is static (never changes), 2) Items are never reordered, and
          3) Items don't have their own state or controlled inputs.
        </p>
        <p className="text-blue-800">
          <strong>Best practice:</strong> Always use a unique, stable identifier (like a database ID
          or UUID) as the key. If your data doesn't have IDs, generate them when fetching/creating data.
        </p>
      </div>
    </div>
  );
};

export default IndexAsKey;
