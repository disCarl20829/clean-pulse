import './CreateAccount.css';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { apiPost } from '../lib/api';
import { ROLES } from '../constants/roles';
import './CreateAccount.css';

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
      localStorage.setItem(
        'cleanpulse_pending_profile',
        JSON.stringify({
          fullName,
          role,
          barangay: barangay || undefined
        })
      );

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password
        });

      if (signUpError) throw signUpError;

      if (!data.session) {
        setNeedsEmailConfirm(true);
        return;
      }

      await apiPost('/users/profile', {
        fullName,
        role,
        barangay: barangay || undefined
      });

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
      <div className="create-account-page">
        <div className="create-account-card confirmation-card">

          <div className="logo-circle">♻</div>

          <h1>Check your email</h1>

          <p>
            We sent a confirmation link to{' '}
            <strong>{email}</strong>.
          </p>

          <p>
            Confirm it, then log in. Your account
            ({' '}
            {ROLES.find((r) => r.value === role)?.label}
            {' '})
            will be set up on first login.
          </p>

          <Link to="/login" className="primary-button">
            Back to login
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="create-account-page">

      <div className="create-account-card">

        <div className="brand">
          <div className="logo-circle">♻</div>
          <span>CleanPulse</span>
        </div>

        <div className="form-header">
          <h1>Create your account</h1>
          <p>
            Join CleanPulse and help build cleaner communities.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Account type</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">
                Select account type
              </option>

              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Barangay{' '}
              {role === 'resident' ? '(optional)' : ''}
            </label>

            <input
              type="text"
              placeholder="Enter your barangay"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="create-button"
            disabled={submitting}
          >
            {submitting
              ? 'Creating account...'
              : 'Create account'}
          </button>

        </form>

        <div className="login-link">
          <span>Already have an account?</span>{' '}
          <Link to="/login">
            Log in
          </Link>
        </div>

      </div>

    </div>
  );
}

