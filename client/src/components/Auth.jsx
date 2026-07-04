import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      // Simulate creating a real user profile in our mock database
      const newUser = {
        email,
        name: fullName || 'New User',
        employeeId: employeeId || 'EMP-' + Math.floor(Math.random() * 1000),
        role: role
      };
      
      alert(`Registration Successful for ${newUser.name} as ${newUser.role}!`);
      // Automatically log them in with their custom data
      onLoginSuccess(newUser);
    } else {
      // Simulate a multi-user sign-in check
      if (email.includes('admin')) {
        onLoginSuccess({ email, name: 'HR Officer', role: 'Admin', employeeId: 'ADM-001' });
      } else {
        onLoginSuccess({ email, name: fullName || email.split('@')[0], role: 'Employee', employeeId: 'EMP-789' });
      }
    }
  };

  return (
    <div style={{
      maxWidth: '400px', 
      margin: '60px auto', 
      padding: '30px', 
      border: '1px solid #333', 
      borderRadius: '8px', 
      background: '#1a1a1a',
      fontFamily: 'sans-serif',
      color: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', color: '#646cff', marginBottom: '20px' }}>
        {isSignUp ? 'Create HRMS Account' : 'HRMS Portal Sign In'}
      </h2>

      {error && <p style={{ color: '#ff4646', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'col', gap: '15px' }}>
        {isSignUp && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} placeholder="John Doe" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Employee ID</label>
              <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} style={inputStyle} placeholder="EMP-123" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Select System Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                <option value="Employee">Employee</option>
                <option value="Admin">HR / Admin Officer</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="name@company.com" required />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
        </div>

        <button type="submit" style={{
          background: '#646cff',
          color: '#fff',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px'
        }}>
          {isSignUp ? 'Register Account' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#aaa', marginTop: '20px' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"} {' '}
        <span 
          onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
          style={{ color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Sign In here' : 'Register here'}
        </span>
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #444',
  background: '#242424',
  color: '#fff',
  boxSizing: 'border-box'
};