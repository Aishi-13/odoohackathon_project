import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("Mocking login for UI testing...");
    onLoginSuccess({ name: "Tester", role: "Employee" }); 
    return;

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Sending credentials to the backend engine (main.js)
      const response = await fetch('http://127.0.0.1:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // SRS 3.1.2: Incorrect credentials display error messages [cite: 7]
        setError(data.error || 'Authentication failed');
        return;
      }

      // SRS 3.1.2: Successful login redirects to the dashboard [cite: 8]
      // Passing the user data (including role) to the parent for redirection
      onLoginSuccess(data.user);

    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Ensure main.js is running.');
    }
  };

  return (
    <div className="auth-container">
      <h2>HRMS Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}