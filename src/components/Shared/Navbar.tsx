import React from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => (
  <nav>
    <span>Schedule App</span>
    {isAuthenticated && <button onClick={onLogout}>Logout</button>}
  </nav>
);

export default Navbar;