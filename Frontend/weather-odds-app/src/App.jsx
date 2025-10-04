import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import BuildQuery from './BuildQuery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/build-query" element={<BuildQuery />} />
      </Routes>
    </Router>
  );
}

export default App;