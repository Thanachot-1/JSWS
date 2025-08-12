import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (userEmail: string) => {
    setIsAuthenticated(true);
    setEmail(userEmail);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/dashboard">
          {isAuthenticated ? <Dashboard currentUser={email} /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;