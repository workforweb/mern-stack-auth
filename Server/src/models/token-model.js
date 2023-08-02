import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
});

tokenSchema.set('timestamps', false);

tokenSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
