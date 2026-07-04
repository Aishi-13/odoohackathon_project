import React from 'react';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      background: '#1a1a1a',
      color: '#fff',
      height: '60px',
      borderBottom: '1px solid #333'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#646cff' }}>Odoo Hackathon</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <span style={{ cursor: 'pointer' }}>Dashboard</span>
        <span style={{ cursor: 'pointer', opacity: 0.7 }}>Features</span>
        <span style={{ cursor: 'pointer', opacity: 0.7 }}>Team</span>
      </div>
    </nav>
  );
}