import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page: <RoleGuard allow={['lgu_admin','barangay_official']}><Overview/></RoleGuard>
export default function RoleGuard({ allow, children }) {
  const { role, loading, session } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!session) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) return <Navigate to="/report" replace />;

  return children;
}
