import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

import Home from './pages/Home'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import Settings from './pages/Settings'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'
import BlockedUsers from './pages/BlockedUsers'


// =========================
// PROTECTED ROUTE
// =========================

const Protected = ({ children }) =>
  localStorage.getItem('token')
    ? children
    : <Navigate to="/login" replace />


export default function App() {

  const location = useLocation()

  // Pages where Navbar should NOT appear
  const authPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ].some(path =>
    location.pathname.startsWith(path)
  )


  return (
    <div className="app-shell">

      {/* Navbar hidden on authentication pages */}
      {!authPage && <Navbar />}


      <Routes>

        {/* =========================
            HOME REDIRECT
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                localStorage.getItem('token')
                  ? '/home'
                  : '/login'
              }
              replace
            />
          }
        />


        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route
          path="/login"
          element={<Login setAuth={() => {}} />}
        />

        <Route
          path="/register"
          element={<Register setAuth={() => {}} />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />


        {/* =========================
            PROTECTED PAGES
        ========================= */}

        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />

        <Route
          path="/explore"
          element={
            <Protected>
              <Explore />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route
          path="/user/:id"
          element={
            <Protected>
              <UserProfile />
            </Protected>
          }
        />

        <Route
          path="/settings"
          element={
            <Protected>
              <Settings />
            </Protected>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <Protected>
              <EditProfile />
            </Protected>
          }
        />

        <Route
          path="/change-password"
          element={
            <Protected>
              <ChangePassword />
            </Protected>
          }
        />

        <Route
          path="/blocked-users"
          element={
            <Protected>
              <BlockedUsers />
            </Protected>
          }
        />


        {/* =========================
            INVALID ROUTE
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>

    </div>
  )
}