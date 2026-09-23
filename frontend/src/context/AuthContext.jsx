import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiGet, apiPost } from '../lib/api';

const PENDING_PROFILE_KEY = 'cleanpulse_pending_profile';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    apiGet('/users/me')
      .then((res) => setProfile(res.profile))
      .catch(async () => {
        // No profile yet — likely a first login right after confirming
        // email. If we stashed signup details, finish creating it now.
        const pending = localStorage.getItem(PENDING_PROFILE_KEY);
        if (!pending) return setProfile(null);

        try {
          const { profile: newProfile } = await apiPost('/users/profile', JSON.parse(pending));
          localStorage.removeItem(PENDING_PROFILE_KEY);
          setProfile(newProfile);
        } catch {
          setProfile(null);
        }
      });
  }, [session]);

  const value = {
    session,
    user: session?.user || null,
    profile,
    role: profile?.role || null,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
