import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function EditProfile() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getMe().then(u => {
      setName(u.name)
      setBio(u.bio || '')
    })
  }, [])

  const submit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const d = await api.updateProfile({ name, bio })
      localStorage.setItem('user', JSON.stringify(d.user))
      nav('/profile')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="content-narrow">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>Edit profile</h1>
          <p>Keep your public details up to date.</p>
        </div>
      </div>

      <form className="card settings-form" onSubmit={submit}>
        <label>
          Display name
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </label>

        <label>
          Bio
          <textarea 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            maxLength={160} 
            rows={5} 
            placeholder="A short introduction…" 
          />
        </label>

        <div className="form-actions">
          <button 
            type="button" 
            className="secondary" 
            onClick={() => nav('/profile')}
          >
            Cancel
          </button>
          
          <button 
            className="primary" 
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </main>
  )
}