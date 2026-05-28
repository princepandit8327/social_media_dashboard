import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Social Media Dashboard</div>
        <nav>
          {user ? (
            <> 
              <Link to="/">Feed</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/analytics">Analytics</Link>
              <button className="link-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <> 
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
};

export default Layout;
