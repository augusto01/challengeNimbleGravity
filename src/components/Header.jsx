import { useState } from 'react';
import '../styles/Header.css';

const Header = ({ candidate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          NIMBLE<span className="logo-accent">GRAVITY</span>
        </div>
        
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <div className="nav-info">
            <span className="label">CANDIDATO:</span>
            <span className="value">{candidate?.firstName} {candidate?.lastName}</span>
          </div>
          <div className="nav-info">
            <span className="label">ENDPOINT:</span>
            <span className="value">{candidate?.email}</span>
          </div>
        </div>

        <button 
          className="nav-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className={isOpen ? 'line open' : 'line'}></div>
          <div className={isOpen ? 'line open' : 'line'}></div>
        </button>
      </div>
    </nav>
  );
};

export default Header;