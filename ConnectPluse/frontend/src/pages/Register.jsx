import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Register({ setAuth }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      const data = await api.register(formData)
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
          <p className="eyebrow">YOUR VOICE, YOUR SPACE</p>
          <h1>Start <em>something.</em></h1>
          <p>Join a thoughtful community built around short-form writing and genuine connection.</p>
        </div>
      </div>

      <form className="card settings-form" onSubmit={handleRegister} style={{ padding: '30px' }}>
        <p className="eyebrow" style={{ marginBottom: '5px' }}>GET STARTED</p>
        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Create account</h3>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>It takes less than a minute.</p>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
          Name
          <input 
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required 
          />
        </label>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
          Username
          <input 
            type="text"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required 
          />
        </label>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
          Mobile Number
          <input 
            type="text"
            name="mobile"
            className="form-input"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="10 digit mobile number"
            required 
          />
        </label>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
          Email
          <input 
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required 
          />
        </label>

        <label style={{ display: 'grid', gap: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
          Password
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required 
              style={{ paddingRight: '45px' }}
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

        <label style={{ display: 'grid', gap: '8px', marginBottom: '24px', fontWeight: '600', fontSize: '13px' }}>
          Confirm Password
          <input 
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required 
          />
        </label>

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
            Already a member? Sign in
          </Link>

          <button 
            type="submit" 
            className="primary" 
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </div>
      </form>
    </main>
  )
}