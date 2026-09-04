
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword() {
  const navigate = useNavigate()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!oldPassword || !newPassword) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:5000/api/auth/change-password',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            oldPassword,
            newPassword
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Password change failed')
        return
      }

      alert('Password changed successfully!')

      setOldPassword('')
      setNewPassword('')

      navigate('/settings')

    } catch (error) {
      console.error('CHANGE PASSWORD ERROR:', error)
      alert('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <div className="card">

        <h1>Change Password</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            className="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/settings')}
          >
            Cancel
          </button>

        </form>

      </div>
    </main>
  )
}

