import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Report from './pages/Report';
import Overview from './pages/Overview';
import Logs from './pages/Logs';
import RecentlyCollected from './pages/RecentlyCollected';

function Nav() {
  const { session, signOut, profile } = useAuth();
  if (!session) return null;

  return (
    <nav style={{ display: 'flex', gap: 16, padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/report">Report</Link>
      <Link to="/overview">Overview</Link>
      <Link to="/logs">Logs</Link>
      <Link to="/recently-collected">Recently Collected</Link>
      <span style={{ marginLeft: 'auto' }}>{profile?.role}</span>
      <button onClick={signOut}>Log out</button>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <div style={{ padding: 16 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/report" element={<RoleGuard><Report /></RoleGuard>} />
            <Route
              path="/overview"
              element={
                <RoleGuard allow={['barangay_official', 'garbage_collector', 'lgu_admin']}>
                  <Overview />
                </RoleGuard>
              }
            />
            <Route
              path="/logs"
              element={
                <RoleGuard allow={['barangay_official', 'garbage_collector', 'lgu_admin']}>
                  <Logs />
                </RoleGuard>
              }
            />
            <Route path="/recently-collected" element={<RoleGuard><RecentlyCollected /></RoleGuard>} />
            <Route path="*" element={<Navigate to="/report" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
