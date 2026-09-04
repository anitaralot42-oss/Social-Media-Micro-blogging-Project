import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Login({ setAuth }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await api.login({ identifier, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setAuth(true)
      nav('/home')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="content-narrow">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONNECTPLUSE</p>
          <h1>Write what matters.</h1>
          <p>A refined space for short thoughts, real conversations and the people behind them.</p>
        </div>
      </div>

      <form className="card settings-form" onSubmit={handleLogin} style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Sign in</h3>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
          Username, email or mobile
          <input 
            type="text"
            className="form-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your username or email"
            required 
          />
        </label>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
          Password
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required 
              style={{ paddingRight: '45px', width: '100%' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {/* FORGOT PASSWORD LINK */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>
            Forgot password?
          </Link>
        </div>

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/register" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
            New here? Create an account
          </Link>

          <button 
            type="submit" 
            className="primary" 
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </div>
      </form>
    </main>
  )
}