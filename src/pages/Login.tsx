import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const USERS = [
  { email: 'Jaosub@woonsen.com', password: 'pass1234' },
  { email: 'Woonsen@jaosub.com', password: 'pass5678' }
];

const Login: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      onLogin(email);
      history.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div style={{marginTop: 16, fontSize: 13, color: "#888"}}>
        <b>ตัวอย่างรหัส:</b><br/>
        Jaosub@woonsen.com / pass1234<br/>
        Woonsen@jaosub.com / pass5678
      </div>
    </div>
  );
};

export default Login;