import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookDetail from './components/BookDetail';
import './App.css'


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:workId" element={<BookDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
