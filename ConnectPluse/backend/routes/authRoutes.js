const router = require('express').Router()

const authController = require('../controllers/authController')
const auth = require('../middleware/authMiddleware')


// =========================
// REGISTER
// =========================

router.post(
  '/register',
  authController.register
)


// =========================
// VERIFY EMAIL
// =========================

router.get(
  '/verify-email/:token',
  authController.verifyEmail
)


// =========================
// LOGIN
// =========================

router.post(
  '/login',
  authController.login
)


// =========================
// FORGOT PASSWORD
// =========================

router.post(
  '/forgot-password',
  authController.forgotPassword
)


// =========================
// RESET PASSWORD
// =========================

router.post(
  '/reset-password/:token',
  authController.resetPassword
)


// =========================
// CHANGE PASSWORD
// =========================

router.put(
  '/change-password',
  auth,
  authController.changePassword
)


module.exports = router