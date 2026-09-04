import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Icon = ({ children }) => (
  <span className="nav-icon" aria-hidden="true">
    {children}
  </span>
)

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // --- Dark Mode Logic Start ---
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Page refresh hone par theme check karega
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    // Theme switch karega aur local storage me save karega
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };
  // --- Dark Mode Logic End ---

  const logout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const avatar = user?.profilePicture?.url

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink to="/home" className="brand">
          <span className="brand-mark">C</span>
          <span>Connect<span>Pluse</span></span>
        </NavLink>
    
        <nav className="nav-links">
          <NavLink to="/home"><Icon>⌂</Icon><span>Home</span></NavLink>
          <NavLink to="/explore"><Icon>◌</Icon><span>Explore</span></NavLink>
          <NavLink to="/profile"><Icon>◎</Icon><span>Profile</span></NavLink>
          <NavLink to="/settings"><Icon>⚙</Icon><span>Settings</span></NavLink>
        </nav>

        <div className="nav-user">
          {/* Dark Mode Toggle Button */}
          <button 
            className="icon-btn" 
            onClick={toggleTheme} 
            title="Toggle Theme"
            style={{ fontSize: '16px', padding: '6px 8px' }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button className="avatar avatar-sm avatar-image" onClick={() => navigate('/profile')} title="Profile">
            {avatar ? <img src={avatar} alt="Profile" /> : (user?.name || 'U').slice(0, 1).toUpperCase()}
          </button>
          <button className="logout-link" onClick={logout}>Log out</button>
        </div>
      </div>
    </header>
  )
}