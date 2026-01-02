import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <main className="ml-72 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
