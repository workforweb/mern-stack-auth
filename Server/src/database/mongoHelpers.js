import mongoose from 'mongoose';
import { Types } from 'mongoose';

export const isValidId = (id) => {
  return Types.ObjectId.isValid(id);
};

// if (!isValidId(id)) throw 'User not found';

export const countDocuments = async (modelName) => {
  return await modelName.countDocuments({});
};

// await countDocuments(User)

export const countDocumentsWithKey = async (modelName, value) => {
  return await modelName.countDocuments(value);
};

// const count = await countDocumentsWithKey(User, { role: Role.Admin });
