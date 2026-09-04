const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Please login first'
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      })
    }

    // IMPORTANT
    req.user = user

    next()

  } catch (error) {

    console.log('AUTH ERROR:', error.message)

    return res.status(401).json({
      message: 'Invalid or expired token'
    })

  }

}