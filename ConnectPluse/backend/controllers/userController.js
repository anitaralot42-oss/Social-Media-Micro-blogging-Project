const User = require('../models/User')
const cloudinary = require('../config/Cloudinary')


// =========================
// GET ALL USERS
// =========================

exports.getUsers = async (req, res) => {
  try {

    const currentUser = await User.findById(req.user._id)

    const query = req.query.q?.trim()
    const filter = { _id: { $ne: req.user._id } }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })

    const result = users.map(user => ({
      ...user.toObject(),

      isBlocked: currentUser.blockedUsers.some(
        id => id.toString() === user._id.toString()
      ),

      isFollowing: currentUser.following.some(
        id => id.toString() === user._id.toString()
      )
    }))

    res.json(result)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}


// =========================
// FOLLOW / UNFOLLOW USER
// =========================

exports.followUser = async (req, res) => {
  try {

    const currentUser = await User.findById(req.user._id)
    const targetUser = await User.findById(req.params.id)

    if (!targetUser) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (
      currentUser._id.toString() === targetUser._id.toString()
    ) {
      return res.status(400).json({
        message: 'You cannot follow yourself'
      })
    }

    const alreadyFollowing = currentUser.following.some(
      id => id.toString() === targetUser._id.toString()
    )

    if (alreadyFollowing) {

      // UNFOLLOW
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      )

      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      )

    } else {

      // FOLLOW
      currentUser.following.push(targetUser._id)
      targetUser.followers.push(currentUser._id)

    }

    await currentUser.save()
    await targetUser.save()

    res.json({
      message: alreadyFollowing
        ? 'User unfollowed'
        : 'User followed',

      following: !alreadyFollowing
    })

  } catch (error) {

    console.log('FOLLOW ERROR:', error.message)

    res.status(500).json({
      message: error.message
    })

  }
}


// =========================
// BLOCK / UNBLOCK USER
// =========================

exports.blockUser = async (req, res) => {
  try {

    const currentUser = await User.findById(req.user._id)
    const targetUser = await User.findById(req.params.id)

    if (!targetUser) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (
      currentUser._id.toString() === targetUser._id.toString()
    ) {
      return res.status(400).json({
        message: 'You cannot block yourself'
      })
    }

    const alreadyBlocked = currentUser.blockedUsers.some(
      id => id.toString() === targetUser._id.toString()
    )

    if (alreadyBlocked) {

      // UNBLOCK
      currentUser.blockedUsers = currentUser.blockedUsers.filter(
        id => id.toString() !== targetUser._id.toString()
      )

    } else {

      // BLOCK
      currentUser.blockedUsers.push(targetUser._id)

      // Block karte hi follow remove
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      )

      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      )

      await targetUser.save()
    }

    await currentUser.save()

    res.json({
      message: alreadyBlocked
        ? 'User unblocked'
        : 'User blocked',

      blocked: !alreadyBlocked
    })

  } catch (error) {

    console.log('BLOCK ERROR:', error.message)

    res.status(500).json({
      message: error.message
    })

  }
}


// =========================
// GET CURRENT USER
// =========================

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('blockedUsers', 'name username email profilePicture')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.log('GET ME ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// =========================
// UPDATE PROFILE
// =========================

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
        bio: bio?.trim() || ''
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.log('UPDATE PROFILE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// =========================
// UPDATE PROFILE PICTURE
// =========================

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'ConnectPluse/profile-pictures',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      stream.end(req.file.buffer)
    })

    if (user.profilePicture?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicture.publicId)
      } catch (error) {
        console.log('OLD PROFILE IMAGE DELETE ERROR:', error.message)
      }
    }

    user.profilePicture = {
      url: result.secure_url,
      publicId: result.public_id
    }

    await user.save()

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    })
  } catch (error) {
    console.log('PROFILE PICTURE ERROR:', error.message)
    res.status(500).json({ message: 'Unable to update profile picture' })
  }
}

// =========================
// REMOVE PROFILE PICTURE
// =========================

exports.removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.profilePicture?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicture.publicId)
      } catch (error) {
        console.log('PROFILE IMAGE DELETE ERROR:', error.message)
      }
    }

    user.profilePicture = {
      url: null,
      publicId: null
    }

    await user.save()

    res.json({
      message: 'Profile picture removed successfully'
    })
  } catch (error) {
    console.log('REMOVE PROFILE PICTURE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// =========================
// GET SINGLE USER PROFILE
// =========================

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const Post = require('../models/Post')

    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'name username email profilePicture')
      .populate('comments.user', 'name username email profilePicture')
      .sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (error) {
    console.log('GET USER PROFILE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
