import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const initials = name => (name || 'U').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()

export default function PostCard({ post, reload }) {
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState('')
  const [showMenu, setShowMenu] = useState(false)
const [editing, setEditing] = useState(false)
const [editContent, setEditContent] = useState(post.content || '')

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
  const liked = post.likes?.some(id => String(id?._id || id) === String(currentUser?.id))
  const date = new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  const handleLike = async () => {
    try { await api.likePost(post._id); await reload() } catch (e) { alert(e.message) }
  }

  const handleComment = async e => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      await api.commentPost(post._id, comment)
      setComment('')
      await reload()
    } catch (e) { alert(e.message) }
  }


  const handleEdit = async () => {
  if (!editContent.trim()) return

  try {
    await api.updatePost(post._id, editContent)
    setEditing(false)
    setShowMenu(false)
    await reload()
  } catch (e) {
    alert(e.message)
  }
}

const handleDelete = async () => {
  const confirmDelete = window.confirm('Delete this post?')

  if (!confirmDelete) return

  try {
    await api.deletePost(post._id)
    setShowMenu(false)
    await reload()
  } catch (e) {
    alert(e.message)
  }
}

  return (
    <article className="post-card card">
      <div className="post-head">
        <Link className="post-author" to={`/user/${post.user?._id}`}>
          <div className="avatar avatar-image">{post.user?.profilePicture?.url ? <img src={post.user.profilePicture.url} alt="" /> : initials(post.user?.name)}</div>
          <div>
            <strong>{post.user?.name || 'Unknown user'}</strong>
            <span>@{post.user?.username || (post.user?.name || 'user').toLowerCase().replace(/\s+/g, '')} · {date}</span>
          </div>
        </Link>
      <div className="post-menu-wrapper">
  <button
    className="more-btn"
    aria-label="More options"
    onClick={() => setShowMenu(v => !v)}
  >
    •••
  </button>

  {showMenu && (
    <div className="post-menu">
      <button onClick={() => {
        setEditing(true)
        setShowMenu(false)
      }}>
        ✏️ Edit Caption
      </button>

      <button className="danger" onClick={handleDelete}>
        🗑️ Delete Post
      </button>
    </div>
  )}
</div>
      </div>

     {editing ? (
  <div className="edit-caption">
    <textarea
      value={editContent}
      onChange={e => setEditContent(e.target.value)}
      maxLength={280}
      autoFocus
    />

    <div className="edit-actions">
      <button
        className="secondary"
        onClick={() => {
          setEditing(false)
          setEditContent(post.content || '')
        }}
      >
        Cancel
      </button>

      <button
        className="primary"
        onClick={handleEdit}
      >
        Save
      </button>
    </div>

    <small>{editContent.length}/280</small>
  </div>
) : (
  <p className="post-content">{post.content}</p>
)}
      {post.media?.url && (
  <div className="post-media">

    {/* IMAGE */}
    {post.media.mediaType === 'image' && (
      <img
        src={post.media.url}
        alt="Post media"
      />
    )}

    {/* VIDEO */}
    {post.media.mediaType === 'video' && (
      <video
        src={post.media.url}
        controls
        preload="metadata"
      />
    )}

    {/* AUDIO */}
    {post.media.mediaType === 'audio' && (
      <audio
        src={post.media.url}
        controls
      />
    )}

  </div>
)}

      <div className="post-actions">
        <button className={liked ? 'action liked' : 'action'} onClick={handleLike}>♡ <span>{post.likes?.length || 0}</span></button>
        <button className="action" onClick={() => setShowCommentBox(v => !v)}>◌ <span>{post.comments?.length || 0}</span></button>
        <button className="action share" onClick={() => navigator.clipboard?.writeText(window.location.href)}>↗ <span>Share</span></button>
      </div>

      {showCommentBox && (
        <form className="comment-form" onSubmit={handleComment}>
          <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a thoughtful reply…" />
          <button className="primary">Reply</button>
        </form>
      )}

      {!!post.comments?.length && (
        <div className="comments">
          {post.comments.slice(-3).map((item, i) => (
            <div className="comment" key={item._id || i}>
              <div className="avatar avatar-xs">{initials(item.user?.name)}</div>
              <div><strong>{item.user?.name || 'User'}</strong><p>{item.text}</p></div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
