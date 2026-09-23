import './App.css';
import { useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from 'react-router-dom';

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
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!session) return null;

  function handleLogout() {
    setShowLogoutModal(true);
  }

  async function confirmLogout() {
    setShowLogoutModal(false);
    await signOut();
  }

  function cancelLogout() {
    setShowLogoutModal(false);
  }

  return (
    <>
      <nav className="navbar">

        {/* Brand */}
        <Link to="/report" className="navbar-brand">
          <div className="navbar-logo">
            ♻
          </div>

          <span>CleanPulse</span>
        </Link>


        {/* Navigation */}
        <div className="navbar-links">

          <Link
            to="/report"
            className={location.pathname === '/report' ? 'active' : ''}
          >
            Report
          </Link>

          <Link
            to="/overview"
            className={location.pathname === '/overview' ? 'active' : ''}
          >
            Overview
          </Link>

          <Link
            to="/logs"
            className={location.pathname === '/logs' ? 'active' : ''}
          >
            Logs
          </Link>

          <Link
            to="/recently-collected"
            className={
              location.pathname === '/recently-collected'
                ? 'active'
                : ''
            }
          >
            Recently Collected
          </Link>

        </div>


        {/* User */}
        <div className="navbar-user">

          <div className="user-info">
            <span className="user-role">
              {profile?.role || 'User'}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>

        </div>

      </nav>


      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={cancelLogout}
        >
          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >


            <h2>Log out?</h2>

            <p>
              Are you sure you want to log out of your CleanPulse account?
            </p>

            <div className="logout-modal-actions">

              <button
                className="logout-cancel-button"
                onClick={cancelLogout}
              >
                Cancel
              </button>

              <button
                className="logout-confirm-button"
                onClick={confirmLogout}
              >
                Log out
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
}


export default function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Nav />

        <main className="app-content">

          <Routes>

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/create-account"
              element={<CreateAccount />}
            />

            <Route
              path="/report"
              element={
                <RoleGuard>
                  <Report />
                </RoleGuard>
              }
            />

            <Route
              path="/overview"
              element={
                <RoleGuard
                  allow={[
                    'barangay_official',
                    'garbage_collector',
                    'lgu_admin'
                  ]}
                >
                  <Overview />
                </RoleGuard>
              }
            />

            <Route
              path="/logs"
              element={
                <RoleGuard
                  allow={[
                    'barangay_official',
                    'garbage_collector',
                    'lgu_admin'
                  ]}
                >
                  <Logs />
                </RoleGuard>
              }
            />

            <Route
              path="/recently-collected"
              element={
                <RoleGuard>
                  <RecentlyCollected />
                </RoleGuard>
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/report"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </BrowserRouter>

    </AuthProvider>
  );
}
