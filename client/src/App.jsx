import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

function App() {
  // State to track who is currently using the app
  const [user, setUser] = useState(null); 

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', background: '#242424', color: 'rgba(255, 255, 255, 0.87)' }}>
      {user ? (
        <>
          {/* Pass user state to the navbar to show their specific account details */}
          <Navbar user={user} onLogout={handleLogout} />
          {/* Pass user state down to the dashboard so it adapts to whoever logged in */}
          <Dashboard user={user} />
        </>
      ) : (
        <Auth onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;