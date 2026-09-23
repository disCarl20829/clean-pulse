import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return setError(signInError.message);
    navigate('/report');
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: '80px auto' }}>
      <h1>CleanPulse</h1>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Log in</button>
      <p>
        No account? <Link to="/create-account">Create one</Link>
      </p>
    </form>
  );
}
