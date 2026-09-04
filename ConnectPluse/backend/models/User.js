const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
  name: 
  { type: String,
     required: true,
      trim: true 
    },

username: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true
},

mobile: {
  type: String,
  required: true,
  unique: true,
  trim: true
},

email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true
},

password: 
{ type: String, 
  required: true
 },

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailVerificationToken: {
      type: String,
      default: null
    },

    emailVerificationExpires: {
      type: Date,
      default: null
    },

    // Forgot password
    passwordResetToken: {
      type: String,
      default: null
    },

    passwordResetExpires: {
      type: Date,
      default: null
    },

    bio: {
      type: String,
      default: ''
    },

    profilePicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)