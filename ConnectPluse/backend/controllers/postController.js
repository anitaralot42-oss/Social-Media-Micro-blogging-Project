const Post = require('../models/Post')
const cloudinary = require('../config/Cloudinary')

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name username email')
      .populate('comments.user', 'name username email')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    console.log('GET POSTS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.createPost = async (req, res) => {
  try {
    const content = req.body.content?.trim() || ''
    const mediaFile = req.file

    if (!content && !mediaFile) {
      return res.status(400).json({ message: 'Post cannot be empty' })
    }

    let media = {
      url: null,
      publicId: null,
      mediaType: null,
      resourceType: null,
      format: null
    }

    if (mediaFile) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'ConnectPluse/posts'
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )

        stream.end(mediaFile.buffer)
      })

      let mediaType = 'image'

      if (result.resource_type === 'video') {
        mediaType = 'video'
      } else if (result.resource_type === 'raw') {
        mediaType = 'audio'
      }

      media = {
        url: result.secure_url,
        publicId: result.public_id,
        mediaType,
        resourceType: result.resource_type,
        format: result.format
      }
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      media
    })

    await post.populate('user', 'name username email')

    res.status(201).json({
      message: 'Post created successfully',
      post
    })
  } catch (error) {
    console.log('CREATE POST ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can delete only your own post'
      })
    }

    if (post.media?.publicId) {
      try {
        await cloudinary.uploader.destroy(post.media.publicId, {
          resource_type: post.media.resourceType || 'image'
        })
      } catch (error) {
        console.log('CLOUDINARY DELETE ERROR:', error.message)
      }
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.log('DELETE POST ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userId = req.user._id
    const alreadyLiked = post.likes.some(
      id => id.toString() === userId.toString()
    )

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        id => id.toString() !== userId.toString()
      )
    } else {
      post.likes.push(userId)
    }

    await post.save()

    res.json({
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      likes: post.likes
    })
  } catch (error) {
    console.log('LIKE POST ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.commentPost = async (req, res) => {
  try {
    const text = req.body.text?.trim()

    if (!text) {
      return res.status(400).json({ message: 'Comment cannot be empty' })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({
      user: req.user._id,
      text
    })

    await post.save()

    await post.populate('user', 'name username email')
    await post.populate('comments.user', 'name username email')

    res.status(201).json(post)
  } catch (error) {
    console.log('COMMENT ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can edit only your own post'
      })
    }

    const content = req.body.content?.trim()

    if (!content) {
      return res.status(400).json({ message: 'Caption cannot be empty' })
    }

    if (content.length > 280) {
      return res.status(400).json({
        message: 'Caption cannot exceed 280 characters'
      })
    }

    post.content = content
    await post.save()
    await post.populate('user', 'name username email')

    res.json({
      message: 'Post updated successfully',
      post
    })
  } catch (error) {
    console.log('UPDATE POST ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
