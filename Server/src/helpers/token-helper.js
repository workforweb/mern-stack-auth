import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Token from '../models/token-model';
import tokenTypes from '../config/tokenTypes';
import { Encrypt, Decrypt } from '../utils/Cryptor';
import ApiError from '../errors/ApiErrors';

const accessSecret =
  'yJzdWIiOiI2NDNiZGE2YmUyMjE1NTE0NDdlMTg2OTciLCJpYXQiOjE2ODE2NTIyODksImV4cCI6MTY';
const refreshSecret =
  'yJzdWIiOiI2NDNiZGE2YmUyMjE1NTE0NDdlMTg2OTciLCJpYXQiOjE2ODE2NTIyODksImV4cCI6MTY';

export const generateToken = async (userId, expires, type, secret) => {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + expires,
    iat: Date.now().valueOf() / 1000,
    type,
  };

  const doEncrypt = jwt.sign(payload, secret);

  const token = await Encrypt(doEncrypt);

  return token;
};

export const saveToken = async (token, userId, expires, type, blacklisted) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires,
    type,
    blacklisted,
  });
  return tokenDoc;
};

const validateToken = async (token, secret) => {
  const payload = await promisify(jwt.verify)(token, secret);
  return payload;
};

export const parseTokenAndGetUserId = async (token) => {
  const decrypted = await Decrypt(token);
  const decoded = await validateToken(decrypted, accessSecret);
  return decoded.sub || '';
};

export const tokenfromheader = async (req) => {
  const authHeader = req.headers['authorization'];

  const bearerToken = authHeader.split(' ');

  const token = bearerToken[1];

  if (!token) return next(new ApiError(401, 'Access Denied'));

  const tokenfromheader = await Decrypt(token);

  return tokenfromheader;
};

export const verifyAccessToken = async (token) => {
  // const decrypted = await Decrypt(token);
  const payload = await validateToken(token, accessSecret);

  if (typeof payload.sub !== 'string') throw new Error(400, 'bad user');

  return payload;
};

export const verifyDBToken = async (token, type) => {
  try {
    const decrypted = await Decrypt(token);
    const payload = await validateToken(decrypted, refreshSecret);

    if (typeof payload.sub !== 'string') throw new Error(400, 'bad user');

    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });

    if (!tokenDoc) throw new Error('Refresh token not found in store');

    return tokenDoc;
  } catch (error) {
    console.error('Token is not valid', error.message);
    return null;
  }
};

// exp: Math.floor(Date.now() / 1000) + (60 * 60),

export const generateAuthTokens = async (user) => {
  // const accessTokenExpires = 30 * 60 // 30 minutes
  const accessTokenExpires = 1 * 30; // 30 sec

  const accessToken = await generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS,
    accessSecret
  );

  const refreshTokenExpires = 365 * 24 * 60 * 60; // 1 yr

  const refreshToken = await generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    refreshSecret
  );

  await Token.create({
    token: refreshToken,
    user: user.id,
    expires: new Date(Date.now() + refreshTokenExpires),
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });

  return {
    access: accessToken,
    accessExpires: accessTokenExpires,

    refresh: refreshToken,
    refreshExpires: refreshTokenExpires,
  };
};

export const randomTokenString = async (str) => {
  return crypto.randomBytes(str).toString('hex');
};
