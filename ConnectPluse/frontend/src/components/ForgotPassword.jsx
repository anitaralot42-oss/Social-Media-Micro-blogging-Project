import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      const data = await api.forgotPassword(cleanEmail)
      setMessage(
        data.message ||
          'If this email is registered, a password reset link has been sent.'
      )
      setEmail('')
    } catch (error) {
      setError(
        error.message || 'Unable to process password reset'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="content-narrow">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACCOUNT SECURITY</p>
          <h1>Get back <em>inside.</em></h1>
          <p>No worries. We'll send you a secure link to create a new password and get you back to ConnectPluse.</p>
        </div>
      </div>

      <form className="card settings-form" onSubmit={submit}>
        <p className="eyebrow">PASSWORD RESET</p>
        <h3>Forgot password?</h3>
        <p className="auth-sub">
          Enter your registered email and we'll send you a secure reset link.
        </p>

        {message && (
          <div className="success-box">
            {message}
          </div>
        )}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <label>
          Email
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
              setMessage('')
            }}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <div className="form-actions">
          <Link to="/login">
            Remember your password? Back to sign in
          </Link>

          <button
            type="submit"
            className="primary"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send reset link →'}
          </button>
        </div>
      </form>
    </main>
  )
}