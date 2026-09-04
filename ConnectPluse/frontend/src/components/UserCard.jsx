import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../services/api'

export default function UserCard({ id, name, username, isBlocked, isFollowing, profilePicture }) {
  const [blocked, setBlocked] = useState(isBlocked)
  const [following, setFollowing] = useState(isFollowing)

  const connect = async () => {
    try {
      const data = await api.followUser(id)
      setFollowing(data.following)
    } catch (error) {
      alert(error.message)
    }
  }

  const block = async () => {
    try {
      const data = await api.blockUser(id)
      setBlocked(data.blocked)
      if (data.blocked) setFollowing(false)
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <article className="user-card card">
      <Link to={`/user/${id}`} className="user-main">
        <div className="avatar avatar-lg avatar-image">
          {profilePicture?.url ? (
            <img src={profilePicture.url} alt="" />
          ) : (
            (name || 'U').slice(0, 1).toUpperCase()
          )}
        </div>

        <div>
          <strong>{name}</strong>
          <span>@{username || 'user'}</span>
        </div>
      </Link>

      <div className="user-actions">
        <Link to={`/user/${id}`} className="ghost-btn">View</Link>
        <button className={following ? 'secondary active' : 'secondary'} onClick={connect}>
          {following ? 'Connected' : 'Connect'}
        </button>
        <button className="icon-btn" onClick={block} title={blocked ? 'Unblock' : 'Block'}>
          {blocked ? '⊘' : '⋯'}
        </button>
      </div>
    </article>
  )
}
