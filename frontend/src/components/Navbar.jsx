import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';

const Navbar = ({ user, logout, theme, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <Code2 size={24} />
        AI Code Buddy
      </Link>
      
      <div className="nav-links">
        <button 
          onClick={toggleTheme} 
          className="btn-secondary" 
          style={{ padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user ? (
          <>
            <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={16} />
              {user.name}
            </span>
            <button onClick={logout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
