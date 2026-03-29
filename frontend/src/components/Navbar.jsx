import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <Code2 size={24} />
        AI Code Buddy
      </Link>
      
      <div className="nav-links">
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
