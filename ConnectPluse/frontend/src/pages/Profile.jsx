import { useEffect, useState } from 'react'
import { api } from '../services/api'
import PostCard from '../components/PostCard'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const loadProfileData = async () => {
    try {
      // Assuming api setup, fallback to local storage user if api fails
      const profileData = currentUser; 
      const postsData = await api.getPosts ? await api.getPosts() : [];
      
      // Filter posts just for this user (demo logic)
      const myPosts = Array.isArray(postsData) ? postsData.filter(p => p.author?._id === currentUser._id || p.author === currentUser._id) : [];

      setProfile(profileData)
      setUserPosts(myPosts)
    } catch (error) {
      console.log('PROFILE ERROR:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  if (loading) {
    return (
      <main className="content-narrow">
        <div className="spinner" style={{ marginTop: '50px' }}></div>
      </main>
    )
  }

  return (
    <main className="content-narrow">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* --- HERO SECTION (Banner) --- */}
        <div className="profile-hero">
          <div className="profile-cover"></div>
        </div>

        {/* --- PROFILE INFO --- */}
        <div className="profile-body">
          <div className="profile-top">
            <div className="avatar avatar-xxl">
              {profile?.profilePicture?.url ? (
                <img src={profile.profilePicture.url} alt="Profile" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
              ) : (
                (profile?.name || 'U').slice(0, 1).toUpperCase()
              )}
            </div>
            <div className="profile-actions">
              <button className="outline-btn">Edit Profile</button>
            </div>
          </div>

          <h1>{profile?.name || 'Your Name'}</h1>
          <p className="handle">@{profile?.username || 'username'}</p>
          <p className="bio">{profile?.bio || 'Computer Science Engineering student. Passionate about software design, full-stack development, and building cool things! 🚀💻'}</p>

          <div className="profile-stats">
            <div>
              <b>{userPosts.length || 15}</b>
              <span>Posts</span>
            </div>
            <div>
              <b>342</b>
              <span>Followers</span>
            </div>
            <div>
              <b>180</b>
              <span>Following</span>
            </div>
          </div>

          {/* --- PROFILE TABS --- */}
          <div className="profile-tabs">
            <button className="profile-tab active">Posts</button>
            <button className="profile-tab">Replies</button>
            <button className="profile-tab">Media</button>
            <button className="profile-tab">Likes</button>
          </div>
        </div>
      </div>

      {/* --- USER'S POSTS --- */}
      <div className="profile-tab-content">
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <PostCard key={post._id} post={post} reload={loadProfileData} />
          ))
        ) : (
          <div className="empty card">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>When you share your thoughts, they'll show up here.</p>
          </div>
        )}
      </div>
    </main>
  )
}