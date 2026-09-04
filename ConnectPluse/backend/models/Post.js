const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    content: {
      type: String,
      maxlength: 280,
      trim: true,
      default: ''
    },

    media: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      mediaType: {
        type: String,
        enum: ['image', 'video', 'audio'],
        default: null
      },
      resourceType: { type: String, default: null },
      format: { type: String, default: null }
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        text: {
          type: String,
          required: true,
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
