// models/User.js
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      sparse: true,
    },
    phone: {
      type: String,
      unique: [true, 'Phone number already exists'],
      sparse: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    image: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Avoid redefining model on hot reload in dev
const User = models.User || model('User', UserSchema);

export default User;
