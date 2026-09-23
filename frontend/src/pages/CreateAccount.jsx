import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { apiPost } from '../lib/api';
import { ROLES } from '../constants/roles';

export default function CreateAccount() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [barangay, setBarangay] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!role) return setError('Please select an account type.');

    setSubmitting(true);
    try {
      // Stashed so AuthContext can finish profile creation after email
      // confirmation, when there's no session yet to call the API with.
      localStorage.setItem(
        'cleanpulse_pending_profile',
        JSON.stringify({ fullName, role, barangay: barangay || undefined })
      );

      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      if (!data.session) {
        setNeedsEmailConfirm(true);
        return;
      }

      await apiPost('/users/profile', { fullName, role, barangay: barangay || undefined });
      localStorage.removeItem('cleanpulse_pending_profile');
      navigate('/report');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (needsEmailConfirm) {
    return (
      <div style={{ maxWidth: 360, margin: '80px auto' }}>
        <h1>Check your email</h1>
        <p>
          We sent a confirmation link to <strong>{email}</strong>. Confirm it, then log in —
          your account ({ROLES.find((r) => r.value === role)?.label}) will be set up on first login.
        </p>
        <Link to="/login">Back to login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '80px auto' }}>
      <h1>Create your CleanPulse account</h1>

      <label>
        Full name
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </label>

      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </label>

      <label>
        Account type
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select account type</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </label>

      <label>
        Barangay {role === 'resident' ? '(optional)' : ''}
        <input value={barangay} onChange={(e) => setBarangay(e.target.value)} />
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating account...' : 'Create account'}
      </button>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
