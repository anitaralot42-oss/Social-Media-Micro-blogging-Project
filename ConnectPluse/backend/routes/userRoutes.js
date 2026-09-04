const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
  getUsers,
  getMe,
  updateProfile,
  updateProfilePicture,
  removeProfilePicture,
  getUserProfile,
  blockUser,
  followUser
} = require('../controllers/userController')

router.use(auth)

router.get('/me', getMe)
router.put('/me', updateProfile)
router.put('/me/profile-picture', upload.single('profilePicture'), updateProfilePicture)
router.delete('/me/profile-picture', removeProfilePicture)

router.get('/:id', getUserProfile)
router.get('/', getUsers)
router.post('/:id/block', blockUser)
router.post('/:id/follow', followUser)

module.exports = router
