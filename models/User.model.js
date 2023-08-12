const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    profileImg: { type: String, default: 'https://i.stack.imgur.com/l60Hf.png' },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    bio: { type: String, default: "bio missing" }
  },
  {
    timestamps: true
  }
);


module.exports = model('User', userSchema)