import { useEffect, useState } from 'react'
import { api } from '../services/api'
import UserCard from '../components/UserCard'

export default function Explore() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users using your existing API setup
        const data = await api.getUsers ? await api.getUsers() : [];
        setUsers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.log('EXPLORE ERROR:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Search filter logic
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="content-wide">
      
      <div className="page-heading explore-heading">
        <div>
          <p className="eyebrow">DISCOVER</p>
          <h1>Explore.</h1>
          <p>Find new people and build your network.</p>
        </div>
        
        {/* Search Box */}
        <div className="search-box">
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: 'var(--ink)', 
              width: '100%',
              fontSize: '15px'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="empty card">
          <div className="spinner"></div>
          <p>Finding people...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="user-grid">
          {filteredUsers.map(user => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <div className="empty card">
          <div className="empty-icon">🔍</div>
          <h3>No users found</h3>
          <p>Try searching for a different name.</p>
        </div>
      )}
    </main>
  )
}