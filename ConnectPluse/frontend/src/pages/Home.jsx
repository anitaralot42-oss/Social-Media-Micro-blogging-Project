import { useEffect, useState, useRef } from 'react'
import { api } from '../services/api'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userStories, setUserStories] = useState([])
  const [activeStory, setActiveStory] = useState(null)
  
  const storyInputRef = useRef(null)

  const loadPosts = async () => {
    try {
      const data = await api.getPosts()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log('HOME POSTS ERROR:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleAddStoryClick = () => {
    storyInputRef.current.click()
  }

  const handleStoryUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setUserStories([imageUrl, ...userStories])
    }
  }

  const dummyStories = [
    { name: 'Aarav', img: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Priya', img: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Rohan', img: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Tanu', img: 'https://i.pravatar.cc/150?u=4' }
  ]

  return (
    <main className="page-grid">
      
      <section className="feed">
        <div className="page-heading">
          <div>
            <h1>Your feed.</h1>
            <p>Ideas, conversations and people worth connecting with.</p>
          </div>
        </div>

        <div className="stories-container">
          <div className="story-item create-story" onClick={handleAddStoryClick}>
            <div className="story-avatar">
              <span className="add-icon">+</span>
            </div>
            <span className="story-name">Add Story</span>
          </div>

          <input 
            type="file" 
            ref={storyInputRef} 
            style={{ display: 'none' }} 
            accept="image/*,video/*"
            onChange={handleStoryUpload}
          />
          
          {userStories.map((story, index) => (
            <div className="story-item" key={index} onClick={() => setActiveStory(story)}>
              <div className="story-avatar active">
                <img src={story} alt="Your Story" />
              </div>
              <span className="story-name">You</span>
            </div>
          ))}

          {dummyStories.map((s, idx) => (
            <div className="story-item" key={idx} onClick={() => setActiveStory(s.img)}>
              <div className="story-avatar active">
                <img src={s.img} alt={s.name} />
              </div>
              <span className="story-name">{s.name}</span>
            </div>
          ))}
        </div>

        {activeStory && (
          <div className="story-modal-overlay" onClick={() => setActiveStory(null)}>
            <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="story-close-btn" onClick={() => setActiveStory(null)}>×</button>
              <div className="story-progress-bar">
                <div className="story-progress-fill"></div>
              </div>
              <img src={activeStory} alt="Story View" className="story-modal-img" />
            </div>
          </div>
        )}

        <CreatePost reload={loadPosts} />

        <div className="section-row">
          <h2>Latest posts</h2>
          <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
        </div>

        {loading ? (
          <div className="empty card">
            <div className="spinner"></div>
            <p>Loading your feed…</p>
          </div>
        ) : posts.length ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} reload={loadPosts} />
          ))
        ) : (
          <div className="empty card">
            <div className="empty-icon">✦</div>
            <h3>Your feed is waiting.</h3>
            <p>Be the first person to publish something.</p>
          </div>
        )}
      </section>

      <aside className="right-rail">
        <div className="card rail-card">
          <div className="section-row">
            <h3>Who to follow</h3>
            <a href="#" style={{fontSize: '12px', color: 'var(--accent)', fontWeight: '600'}}>View all</a>
          </div>
          
          <div className="user-card" style={{padding: '10px 0', borderBottom: '1px solid var(--line)'}}>
            <div className="user-main">
              <div className="avatar avatar-sm">RV</div>
              <div>
                <strong>Rohan Verma</strong>
                <span>@rohan_verma</span>
              </div>
            </div>
            <button className="outline-btn" style={{padding: '5px 12px'}}>Follow</button>
          </div>

          <div className="user-card" style={{padding: '10px 0'}}>
            <div className="user-main">
              <div className="avatar avatar-sm">AP</div>
              <div>
                <strong>Anita Patel</strong>
                <span>@anita_patel</span>
              </div>
            </div>
            <button className="outline-btn" style={{padding: '5px 12px'}}>Follow</button>
          </div>
        </div>

        <div className="card rail-card">
          <div className="section-row">
            <h3>Trending</h3>
            <a href="#" style={{fontSize: '12px', color: 'var(--accent)', fontWeight: '600'}}>View all</a>
          </div>
          
          <div className="rail-link" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <strong>#WebDevelopment</strong>
            <span style={{color: 'var(--muted)', fontSize: '11px', marginTop: '4px'}}>12.5K posts</span>
          </div>
          <div className="rail-link" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <strong>#JavaScript</strong>
            <span style={{color: 'var(--muted)', fontSize: '11px', marginTop: '4px'}}>8.7K posts</span>
          </div>
          <div className="rail-link" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <strong>#ReactJS</strong>
            <span style={{color: 'var(--muted)', fontSize: '11px', marginTop: '4px'}}>6.3K posts</span>
          </div>
        </div>

        <div className="footer-note">
          © 2026 ConnectPluse.<br/>
          Built for developers & creators.
        </div>
      </aside>

    </main>
  )
}