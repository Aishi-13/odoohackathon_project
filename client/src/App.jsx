import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', background: '#242424', color: 'rgba(255, 255, 255, 0.87)' }}>
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;