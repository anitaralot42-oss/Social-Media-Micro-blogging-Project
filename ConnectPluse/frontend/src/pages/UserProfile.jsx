import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import PostCard from '../components/PostCard'

export default function UserProfile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const load = async () => {
    try {
      const data = await api.getUserProfile(id)
      setUser(data.user)
      setPosts(Array.isArray(data.posts) ? data.posts : [])

      const me = await api.getMe()
      setConnected(
        me.following?.some(item => String(item) === String(id)) || false
      )
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleConnect = async () => {
    try {
      const data = await api.followUser(id)
      setConnected(data.following)
    } catch (error) {
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <main className="content-narrow">
        <div className="empty card">
          <div className="spinner"></div>
          <p>Loading profile…</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="content-narrow">
        <div className="empty card">User not found.</div>
      </main>
    )
  }

  const image = user.profilePicture?.url

  return (
    <main className="content-narrow">
      <div className="profile-hero card">
        <div className="profile-cover"></div>

        <div className="profile-body">
          <div className="profile-top">
            <div className="avatar avatar-xxl avatar-image">
              {image ? (
                <img src={image} alt="Profile" />
              ) : (
                user.name?.slice(0, 1).toUpperCase() || 'U'
              )}
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className={connected ? 'secondary active' : 'primary'}
                onClick={handleConnect}
              >
                {connected ? 'Connected' : 'Connect'}
              </button>
              <Link className="outline-btn" to="/explore">← Explore</Link>
            </div>
          </div>

          <h1>{user.name}</h1>
          <p className="handle">@{user.username || 'user'}</p>
          <p className="bio">{user.bio || 'No bio added yet.'}</p>

          <div className="profile-stats">
            <div><b>{posts.length}</b><span>Posts</span></div>
            <div><b>{user.followers?.length || 0}</b><span>Connections</span></div>
            <div><b>{user.following?.length || 0}</b><span>Connected</span></div>
          </div>
        </div>
      </div>

      <div className="section-row profile-section-title">
        <h2>Posts</h2>
        <span>{posts.length}</span>
      </div>

      {posts.length ? (
        posts.map(post => (
          <PostCard key={post._id} post={post} reload={load} />
        ))
      ) : (
        <div className="empty card">
          <h3>Nothing here yet.</h3>
          <p>This profile hasn't published a post.</p>
        </div>
      )}
    </main>
  )
}
