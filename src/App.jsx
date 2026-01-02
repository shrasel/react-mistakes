import { useState } from 'react';
import Layout from './components/Layout';
import MemoizationVsColocation from './pages/MemoizationVsColocation';
import FearingReRenders from './pages/FearingReRenders';
import ContextMisuse from './pages/ContextMisuse';
import IndexAsKey from './pages/IndexAsKey';
import UseEffectRedundancy from './pages/UseEffectRedundancy';

function App() {
  const [currentPage, setCurrentPage] = useState('memoization');

  const renderPage = () => {
    switch (currentPage) {
      case 'memoization':
        return <MemoizationVsColocation />;
      case 'fearing-rerenders':
        return <FearingReRenders />;
      case 'context-misuse':
        return <ContextMisuse />;
      case 'index-as-key':
        return <IndexAsKey />;
      case 'useeffect-redundancy':
        return <UseEffectRedundancy />;
      default:
        return <MemoizationVsColocation />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
