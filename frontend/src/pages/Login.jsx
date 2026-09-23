import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (signInError) {
      return setError(signInError.message);
    }

    navigate('/report');
  }

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo */}
        <div className="brand">
          <div className="logo-circle">♻</div>
          <span>CleanPulse</span>
        </div>

        {/* Header */}
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>
            Sign in to your CleanPulse account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Log in
          </button>

        </form>

        {/* Create account */}
        <div className="create-account-link">
          <span>Don't have an account?</span>{' '}

          <Link to="/create-account">
            Create one
          </Link>
        </div>

        {/* Footer */}
        <div className="login-footer">
          CleanPulse Climate Technology
        </div>

      </div>

    </div>
  );
}

