import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './BookList';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* The Store Homepage */}
        <Route path="/" element={<BookList />} />
        
        {/* The Mission 13 Admin Page */}
        <Route path="/adminbooks" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;