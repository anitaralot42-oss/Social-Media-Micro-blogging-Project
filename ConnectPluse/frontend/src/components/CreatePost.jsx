import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function CreatePost({ reload }) {
  const [content, setContent] = useState('')
  const [media, setMedia] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  // Create preview for selected media
  useEffect(() => {
    if (!media) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(media)

    setPreview({
      url,
      type: media.type
    })

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [media])

  // Select image / video / audio
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMedia(file)
  }

  // Publish post
  const handlePost = async (e) => {
    e.preventDefault()

    if (!content.trim() && !media) {
      return
    }

    try {
      setLoading(true)

      await api.createPost(
        content,
        media
      )

      // Reset form
      setContent('')
      setMedia(null)
      setPreview(null)

      e.target.reset()

      // Reload posts
      await reload()

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="composer card"
      onSubmit={handlePost}
    >

      {/* HEADER */}
      <div className="composer-top">
        <div className="avatar">C</div>
        <div>
          <h3>Create a post</h3>
          <p>
            Share a thought with your community.
          </p>
        </div>
      </div>

      {/* TEXT */}
      <textarea
        className="composer-input"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="What’s happening?"
        maxLength={280}
        rows={4}
      />

      {/* MEDIA PREVIEW */}
      {preview && (
        <div className="media-preview">

          {/* IMAGE */}
          {preview.type.startsWith('image/') && (
            <img
              src={preview.url}
              alt="Selected media preview"
            />
          )}

          {/* VIDEO */}
          {preview.type.startsWith('video/') && (
            <video
              src={preview.url}
              controls
            />
          )}

          {/* AUDIO */}
          {preview.type.startsWith('audio/') && (
            <audio
              src={preview.url}
              controls
            />
          )}

          {/* REMOVE MEDIA */}
          <button
            type="button"
            className="remove-media"
            onClick={() => {
              setMedia(null)
              setPreview(null)
            }}
          >
            Remove
          </button>

        </div>
      )}

      {/* FOOTER */}
      <div className="composer-footer">

        {/* MEDIA PICKER */}
        <div>
          <label className="media-picker">
            📎 Add media
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        {/* PUBLISH BUTTON */}
        <button
          type="submit"
          className="primary"
          disabled={
            loading ||
            (!content.trim() && !media)
          }
        >
          {loading
            ? 'Publishing…'
            : 'Publish post →'}
        </button>

      </div>

    </form>
  )
}