import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>Workspace Dashboard</h1>
        <p style={{ color: '#888', margin: 0 }}>Welcome, Member 1. Manage your hackathon modules here.</p>
      </header>
      
      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {/* Card 1 */}
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#111' }}>
          <h3>Project Status</h3>
          <p style={{ color: '#aaa' }}>Frontend setup complete. Development server running smoothly.</p>
        </div>

        {/* Card 2 */}
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#111' }}>
          <h3>Team Tasks</h3>
          <p style={{ color: '#aaa' }}>Repository pushed. Ready for collaborators to pull down code.</p>
        </div>
      </main>
    </div>
  );
}