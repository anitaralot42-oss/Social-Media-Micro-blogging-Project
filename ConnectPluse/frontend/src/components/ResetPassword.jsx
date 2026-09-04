import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!password || !confirmPassword) {
      setError('Please fill both password fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const data = await api.resetPassword(token, password)

      setMessage(
        data.message || 'Password reset successfully!'
      )

      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (err) {
      setError(
        err.message || 'Unable to reset password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-art">

        <div className="art-logo">
          <span className="brand-mark">C</span>
          ConnectPluse
        </div>

        <div className="art-copy">

          <p className="eyebrow">
            ACCOUNT SECURITY
          </p>

          <h1>
            Create a
            <br />
            <em>new key.</em>
          </h1>

          <p>
            Choose a strong password and get back
            to your conversations securely.
          </p>

        </div>

        <div className="art-orbit orbit-one"></div>
        <div className="art-orbit orbit-two"></div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-panel">

        <div className="auth-form">

          <p className="eyebrow">
            PASSWORD RESET
          </p>

          <h2>
            Reset password
          </h2>

          <p className="auth-sub">
            Create a new password for your
            ConnectPluse account.
          </p>


          {/* ERROR */}
          {error && (
            <div className="error-box">
              {error}
            </div>
          )}


          {/* SUCCESS */}
          {message && (
            <div
              className="success-box"
              style={{
                padding: '12px 14px',
                marginBottom: '18px',
                borderRadius: '8px',
                background: '#e9f9ef',
                color: '#176b36',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {message}
            </div>
          )}


          <form onSubmit={handleReset}>

            {/* NEW PASSWORD */}
            <label>
              New Password

              <div
                style={{
                  position: 'relative'
                }}
              >

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  style={{
                    paddingRight: '48px',
                    width: '100%'
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '4px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>

              </div>
            </label>


            {/* CONFIRM PASSWORD */}
            <label>
              Confirm Password

              <div
                style={{
                  position: 'relative'
                }}
              >

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  style={{
                    paddingRight: '48px',
                    width: '100%'
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '4px'
                  }}
                >
                  {showConfirmPassword
                    ? '🙈'
                    : '👁️'}
                </button>

              </div>
            </label>


            {/* RESET BUTTON */}
            <button
              type="submit"
              className="primary auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Resetting…'
                : 'Reset Password →'}
            </button>

          </form>


          {/* LOGIN LINK */}
          <p className="auth-switch">
            Remember your password?{' '}

            <Link to="/login">
              Back to sign in
            </Link>
          </p>

        </div>

      </div>

    </main>
  )
}