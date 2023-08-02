import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import Roles from '../config/roles';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User email required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  username: {
    type: String,
    required: [true, 'User username required'],
    unique: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
        throw new Error(
          'Username must contain at least one letter and one number'
        );
      }
    },
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    maxlength: 10,
    validate(value) {
      if (!value.match(/[6-9]{1}[0-9]{9}/)) {
        throw new Error('Not a valid phone number');
      }
    },
    required: [true, 'User phone number required'],
  },
  password: {
    type: String,
    required: [true, 'User password required'],
    trim: true,
    minlength: 8,
    validate(value) {
      if (
        !value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
        )
      ) {
        throw new Error(
          'Atleast 1 letter, 1 number, 1 special character and SHOULD NOT start with a special character'
        );
      }
    },
  },
  role: {
    type: String,
    enum: Object.keys(Roles),
    default: Roles.User,
    required: [true, 'Please specify user role'],
  },
  acceptTerms: {
    type: Boolean,
    default: false,
    required: [true, 'Please accept terms'],
  },
});

userSchema.set('timestamps', true);

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

userSchema.static('isEmailTaken', async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

userSchema.method('isPasswordMatch', async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
