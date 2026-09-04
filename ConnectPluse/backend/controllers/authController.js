const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const transporter = require('../config/email')

// =========================
// GENERATE JWT
// =========================

function generateToken(userId) {
  return jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}


// =========================
// REGISTER
// =========================

exports.register = async (req, res) => {
  try {
    const {
      name,
      username,
      mobile,
      email,
      password
    } = req.body

    // Check required fields
    if (!name || !username || !mobile || !email || !password) {
      return res.status(400).json({
        message:
          'Name, username, mobile, email and password are required'
      })
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      })
    }

    // Normalize values
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUsername = username.trim().toLowerCase()
    const normalizedMobile = mobile.trim()

    // Check duplicate email, username or mobile
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
        { mobile: normalizedMobile }
      ]
    })

    if (existingUser) {
      return res.status(400).json({
        message:
          'Email, username or mobile number already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create email verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString('hex')

    // Create user
    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      mobile: normalizedMobile,
      email: normalizedEmail,
      password: hashedPassword,

      isEmailVerified: false,

      emailVerificationToken: verificationToken,

      emailVerificationExpires: new Date(
        Date.now() + 15 * 60 * 1000
      )
    })

    // Verification link
    const verificationLink =
      `http://localhost:5000/api/auth/verify-email/${verificationToken}`

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Verify your ConnectPluse email',

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 12px;
        ">

          <h1>Welcome to ConnectPluse 🚀</h1>

          <p>Hi ${name.trim()},</p>

          <p>
            Thanks for creating your ConnectPluse account.
          </p>

          <p>
            Please verify your email address by clicking
            the button below.
          </p>

          <a
            href="${verificationLink}"
            style="
              display:inline-block;
              padding:12px 22px;
              background:#111;
              color:#fff;
              text-decoration:none;
              border-radius:8px;
              margin:15px 0;
            "
          >
            Verify Email
          </a>

          <p>
            This verification link will expire in
            <strong>15 minutes</strong>.
          </p>

          <p>
            If you didn't create this account,
            you can ignore this email.
          </p>

        </div>
      `
    })

    // Registration response
    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.'
    })

  } catch (error) {
    console.log('REGISTER ERROR:', error.message)

    res.status(500).json({
      message: 'Registration failed'
    })
  }
}


// =========================
// VERIFY EMAIL
// =========================

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: {
        $gt: new Date()
      }
    })

    if (!user) {
      return res.status(400).send(`
        <h2>Email verification failed ❌</h2>
        <p>This verification link is invalid or has expired.</p>
      `)
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpires = null

    await user.save()

    res.send(`
      <div style="
        font-family: Arial, sans-serif;
        text-align:center;
        padding:60px;
      ">

        <h1>Email Verified Successfully ✅</h1>

        <p>
          Your ConnectPluse account has been verified.
        </p>

        <p>
          You can now return to the app and login.
        </p>

      </div>
    `)

  } catch (error) {
    console.log('VERIFY EMAIL ERROR:', error.message)

    res.status(500).send(`
      <h2>Something went wrong ❌</h2>
    `)
  }
}


// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {
  try {
    const {
      identifier,
      password
    } = req.body

    // Check required fields
    if (!identifier || !password) {
      return res.status(400).json({
        message:
          'Username, mobile number or email and password are required'
      })
    }

    // Normalize identifier
    const normalizedIdentifier =
      identifier.trim().toLowerCase()

    // Find user using email OR username OR mobile
    const user = await User.findOne({
      $or: [
        {
          email: normalizedIdentifier
        },
        {
          username: normalizedIdentifier
        },
        {
          mobile: identifier.trim()
        }
      ]
    })

    // User not found
    if (!user) {
      return res.status(401).json({
        message:
          'Invalid username, mobile number or email'
      })
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message:
          'Please verify your email before logging in'
      })
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid password'
      })
    }

    // Generate JWT
    const token = generateToken(user._id)

    // Send response
    res.json({
      message: 'Login successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        email: user.email
      }
    })

  } catch (error) {
    console.log('LOGIN ERROR:', error.message)

    res.status(500).json({
      message: 'Login failed'
    })
  }
}


// =========================
// FORGOT PASSWORD
// =========================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    const normalizedEmail =
      email.trim().toLowerCase()

    const user = await User.findOne({
      email: normalizedEmail
    })

    // Don't reveal whether email exists
    if (!user) {
      return res.json({
        message:
          'If this email is registered, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = crypto
      .randomBytes(32)
      .toString('hex')

  await User.updateOne(
  { _id: user._id },
  {
    $set: {
      passwordResetToken: resetToken,
      passwordResetExpires: new Date(
        Date.now() + 15 * 60 * 1000
      )
    }
  }
)
    // Reset link
    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`

    // Send reset email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Reset your ConnectPluse password',

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 12px;
        ">

          <h1>Reset your password 🔐</h1>

          <p>Hi ${user.name},</p>

          <p>
            We received a request to reset your
            ConnectPluse password.
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 22px;
              background:#111;
              color:#fff;
              text-decoration:none;
              border-radius:8px;
              margin:15px 0;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in
            <strong>15 minutes</strong>.
          </p>

          <p>
            If you didn't request this,
            you can safely ignore this email.
          </p>

        </div>
      `
    })

    res.json({
      message:
        'If this email is registered, a password reset link has been sent.'
    })

  } catch (error) {
    console.log(
      'FORGOT PASSWORD ERROR:',
      error.message
    )

    res.status(500).json({
      message:
        'Unable to process password reset'
    })
  }
}


// =========================
// RESET PASSWORD
// =========================

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body

    if (!newPassword) {
      return res.status(400).json({
        message: 'New password is required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          'Password must be at least 6 characters'
      })
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: new Date()
      }
    })

    if (!user) {
      return res.status(400).json({
        message:
          'Reset link is invalid or has expired'
      })
    }

    // Hash new password
    user.password = await bcrypt.hash(
      newPassword,
      10
    )

    // Clear reset token
    user.passwordResetToken = null
    user.passwordResetExpires = null

    await user.save()

    res.json({
      message:
        'Password reset successfully'
    })

  } catch (error) {
    console.log(
      'RESET PASSWORD ERROR:',
      error.message
    )

    res.status(500).json({
      message:
        'Unable to reset password'
    })
  }
}


// =========================
// CHANGE PASSWORD
// =========================

exports.changePassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword
    } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          'Old password and new password are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          'New password must be at least 6 characters'
      })
    }

    const user = await User.findById(
      req.user._id
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const passwordMatch = await bcrypt.compare(
      oldPassword,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          'Current password is incorrect'
      })
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    )

    await user.save()

    res.json({
      message:
        'Password changed successfully'
    })

  } catch (error) {
    console.log(
      'CHANGE PASSWORD ERROR:',
      error.message
    )

    res.status(500).json({
      message:
        'Password change failed'
    })
  }
}