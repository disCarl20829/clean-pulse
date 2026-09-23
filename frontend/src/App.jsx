
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

import Landing from './pages/Landing';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Report from './pages/Report';
import Overview from './pages/Overview';
import Unresolved from './pages/Unresolved';
import Logs from './pages/Logs';
import RecentlyCollected from './pages/RecentlyCollected';


function Nav() {
  const { session, signOut, profile } = useAuth();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /*
    Do not show the authenticated navbar
    when the user is not logged in.
  */
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

      {/* =========================================
          AUTHENTICATED NAVBAR
      ========================================= */}

      <nav className="navbar">

        {/* BRAND */}
        <Link
          to="/report"
          className="navbar-brand"
        >
          <div className="navbar-logo">
            ♻
          </div>

          <span>
            CleanPulse
          </span>
        </Link>


        {/* NAVIGATION */}
        <div className="navbar-links">

          <Link
            to="/report"
            className={
              location.pathname === '/report'
                ? 'active'
                : ''
            }
          >
            Report
          </Link>


          <Link
            to="/overview"
            className={
              location.pathname === '/overview'
                ? 'active'
                : ''
            }
          >
            Overview
          </Link>


          <Link
            to="/unresolved"
            className={
              location.pathname === '/unresolved'
                ? 'active'
                : ''
            }
          >
            Unresolved
          </Link>


          <Link
            to="/logs"
            className={
              location.pathname === '/logs'
                ? 'active'
                : ''
            }
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


        {/* USER */}
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


      {/* =========================================
          LOGOUT CONFIRMATION MODAL
      ========================================= */}

      {showLogoutModal && (

        <div
          className="logout-modal-overlay"
          onClick={cancelLogout}
        >

          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>
              Log out?
            </h2>


            <p>
              Are you sure you want to log out of your
              CleanPulse account?
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

        {/* Authenticated navbar */}
        <Nav />


        <main className="app-content">

          <Routes>

            {/* =========================================
                PUBLIC LANDING PAGE
            ========================================= */}

            <Route
              path="/"
              element={<Landing />}
            />


            {/* =========================================
                AUTHENTICATION
            ========================================= */}

            <Route
              path="/login"
              element={<Login />}
            />


            <Route
              path="/create-account"
              element={<CreateAccount />}
            />


            {/* =========================================
                REPORT
            ========================================= */}

            <Route
              path="/report"
              element={
                <RoleGuard>
                  <Report />
                </RoleGuard>
              }
            />


            {/* =========================================
                OVERVIEW
            ========================================= */}

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


            {/* =========================================
                UNRESOLVED
            ========================================= */}

            <Route
              path="/unresolved"
              element={
                <RoleGuard
                  allow={[
                    'barangay_official',
                    'garbage_collector',
                    'lgu_admin'
                  ]}
                >
                  <Unresolved />
                </RoleGuard>
              }
            />


            {/* =========================================
                LOGS
            ========================================= */}

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


            {/* =========================================
                RECENTLY COLLECTED
            ========================================= */}

            <Route
              path="/recently-collected"
              element={
                <RoleGuard>
                  <RecentlyCollected />
                </RoleGuard>
              }
            />


            {/* =========================================
                FALLBACK
            ========================================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
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
