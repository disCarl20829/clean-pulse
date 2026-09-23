import './App.css';
import { useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate
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
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Do not show the authenticated navbar
  // when the user is not logged in.
  if (!session) return null;

  // Only LGU Admin can see the admin navigation.
  const isAdmin = profile?.role === 'lgu_admin';


  function handleLogout() {
    setShowLogoutModal(true);
  }


  async function confirmLogout() {
    setShowLogoutModal(false);

    await signOut();

    // Return to the Landing Page after logout.
    navigate('/', { replace: true });
  }


  function cancelLogout() {
    setShowLogoutModal(false);
  }


  return (
    <>
      {/* =================================
          AUTHENTICATED NAVBAR
      ================================= */}

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

          {/* REPORT - ALL LOGGED-IN USERS */}
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


          {/* ADMIN-ONLY NAVIGATION */}
          {isAdmin && (
            <>

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

            </>
          )}

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


      {/* =================================
          LOGOUT MODAL
      ================================= */}

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

        <Nav />

        <main className="app-content">

          <Routes>

            {/* =================================
                MAIN PAGE
                OPENING localhost:5173 WILL SHOW
                THE LANDING PAGE
            ================================= */}

            <Route
              path="/"
              element={<Landing />}
            />


            {/* =================================
                LOGIN
            ================================= */}

            <Route
              path="/login"
              element={<Login />}
            />


            {/* =================================
                CREATE ACCOUNT
            ================================= */}

            <Route
              path="/create-account"
              element={<CreateAccount />}
            />


            {/* =================================
                REPORT
                ALL LOGGED-IN USERS
            ================================= */}

            <Route
              path="/report"
              element={
                <RoleGuard>
                  <Report />
                </RoleGuard>
              }
            />


            {/* =================================
                OVERVIEW
                ADMIN ONLY
            ================================= */}

            <Route
              path="/overview"
              element={
                <RoleGuard
                  allow={['lgu_admin']}
                >
                  <Overview />
                </RoleGuard>
              }
            />


            {/* =================================
                UNRESOLVED
                ADMIN ONLY
            ================================= */}

            <Route
              path="/unresolved"
              element={
                <RoleGuard
                  allow={['lgu_admin']}
                >
                  <Unresolved />
                </RoleGuard>
              }
            />


            {/* =================================
                LOGS
                ADMIN ONLY
            ================================= */}

            <Route
              path="/logs"
              element={
                <RoleGuard
                  allow={['lgu_admin']}
                >
                  <Logs />
                </RoleGuard>
              }
            />


            {/* =================================
                RECENTLY COLLECTED
                ADMIN ONLY
            ================================= */}

            <Route
              path="/recently-collected"
              element={
                <RoleGuard
                  allow={['lgu_admin']}
                >
                  <RecentlyCollected />
                </RoleGuard>
              }
            />


            {/* =================================
                ANY UNKNOWN URL
                GOES TO LANDING PAGE
            ================================= */}

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
