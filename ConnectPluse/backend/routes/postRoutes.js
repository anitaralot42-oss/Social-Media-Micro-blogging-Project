const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const controller = require('../controllers/postController')

router.use(auth)

router.get('/', controller.getPosts)

router.post(
  '/',
  upload.single('media'),
  controller.createPost
)

router.put('/:id', controller.updatePost)
router.delete('/:id', controller.deletePost)
router.post('/:id/like', controller.likePost)
router.post('/:id/comments', controller.commentPost)

module.exports = router
