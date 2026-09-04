import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', username: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Local storage se current user ka data load karna
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    setUser({
      name: currentUser.name || '',
      username: currentUser.username || '',
      bio: currentUser.bio || ''
    })
  }, [])

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      // Backend api call for updating profile
      if (api.updateProfile) {
        const updatedUser = await api.updateProfile(user)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      setMessage('Settings saved successfully! ✅')
    } catch (err) {
      setMessage('Failed to save settings. ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="content-narrow">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PREFERENCES</p>
          <h1>Settings.</h1>
          <p>Manage your account details and preferences.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '25px' }}>
        <form className="settings-form" onSubmit={handleSave}>
          
          {/* Success / Error Message Alert */}
          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '10px', 
              background: message.includes('✅') ? 'var(--accent-2)' : '#ffebee', 
              color: message.includes('✅') ? 'var(--accent)' : 'var(--danger)', 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              {message}
            </div>
          )}

          <div className="setting-group">
            <h3 style={{ color: 'var(--accent)', margin: '0 0 18px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Public Profile
            </h3>
            
            <label>
              Display Name
              <input type="text" name="name" value={user.name} onChange={handleChange} className="form-input" placeholder="Your full name" />
            </label>

            <label style={{ marginTop: '16px' }}>
              Username
              <input type="text" name="username" value={user.username} onChange={handleChange} className="form-input" placeholder="@username" />
            </label>

            <label style={{ marginTop: '16px' }}>
              Bio
              <textarea name="bio" value={user.bio} onChange={handleChange} rows="4" className="form-input" placeholder="Tell the community about yourself..." />
            </label>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="outline-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* --- DANGER ZONE --- */}
      <div className="card" style={{ marginTop: '20px', borderColor: 'var(--danger)' }}>
        <div style={{ padding: '5px' }}>
          <h3 style={{ color: 'var(--danger)', margin: '0 0 8px 0', fontSize: '16px' }}>Danger Zone</h3>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px', lineHeight: '1.5' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="outline-btn" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            Delete Account
          </button>
        </div>
      </div>
    </main>
  )
}