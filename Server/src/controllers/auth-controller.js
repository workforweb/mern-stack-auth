import Role from '../config/roles';
import tokenTypes from '../config/tokenTypes';
import { countDocuments, isValidId } from '../database/mongoHelpers';
import ApiError from '../errors/ApiErrors';
import { generateAuthTokens, verifyDBToken } from '../helpers/token-helper';
import Token from '../models/token-model';
import User from '../models/user-model';

export default {
  postRegisterUser: async (req, res, next) => {
    try {
      const {
        name,
        email,
        phone,
        username,
        password,
        confirmPassword,
        acceptTerms,
      } = req.body;

      if (await User.isEmailTaken(email))
        return next(new ApiError(400, `Email ${email} already registered`));

      const user = new User();

      // first registered account is an admin
      const isFirstAccount = (await countDocuments(User)) === 0;
      user.role = isFirstAccount ? Role.Admin : Role.User;

      user.name = name;
      user.email = email;
      user.username = username;
      user.phone = phone;
      user.password = password;
      user.confirmPassword = confirmPassword;
      user.acceptTerms = acceptTerms;

      await user.save();

      res.status(201).json({ message: 'User successfully registered!' });
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  postLoginUserWithEmail: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        email: email,
      });

      if (!user || !(await user.isPasswordMatch(password)))
        return next(new ApiError(401, 'Invalid credentials'));

      const tokens = await generateAuthTokens(user);

      return res
        .cookie('refreshToken', tokens.refresh, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: tokens.refreshExpires * 1000, // always calculate time in milliseconds
          expires: new Date(Date.now() + tokens.refreshExpires * 1000), // always calculate time in milliseconds
          secure: true,
        })
        .header('Authorization', 'Bearer ' + tokens.access)
        .send({ accessToken: tokens.access });
      // .json({ /*user,*/ access: tokens.access });
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  postLoginUserWithUsername: async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({
        username: username,
      });

      if (!user || !(await user.isPasswordMatch(password)))
        return next(new ApiError(401, 'Invalid credentials'));

      const tokens = await generateAuthTokens(user);

      return res
        .cookie('refreshToken', tokens.refresh, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: tokens.refreshExpires * 1000, // always calculate time in milliseconds
          expires: new Date(Date.now() + tokens.refreshExpires * 1000), // always calculate time in milliseconds
          secure: true,
        })
        .header('Authorization', 'Bearer ' + tokens.access)
        .send({ accessToken: tokens.access });
      // .json({ /*user,*/ access: tokens.access });
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  postLoginUserWithPhone: async (req, res, next) => {
    const { phone, password } = req.body;

    try {
      const user = await User.findOne({
        phone: phone,
      });

      if (!user || !(await user.isPasswordMatch(password)))
        return next(new ApiError(401, 'Invalid credentials'));

      const tokens = await generateAuthTokens(user);

      return res
        .cookie('refreshToken', tokens.refresh, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: tokens.refreshExpires * 1000, // always calculate time in milliseconds
          expires: new Date(Date.now() + tokens.refreshExpires * 1000), // always calculate time in milliseconds
          secure: true,
        })
        .header('Authorization', 'Bearer ' + tokens.access)
        .send({ accessToken: tokens.access });
      // .json({ /*user,*/ access: tokens.access });
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  postLogoutUser: async (req, res, next) => {
    // accept token from cookie
    const { refreshToken } = req.cookies;
    try {
      if (!refreshToken) return next(new ApiError(400, 'Token is required'));

      const verifiedRefToken = await verifyDBToken(
        refreshToken,
        tokenTypes.REFRESH
      );

      if (!verifiedRefToken) return next(new ApiError(404, 'Token not found'));

      if (!isValidId(req.user.id))
        return next(new ApiError(400, 'User not found'));

      const user = await User.findById(req.user.id);
      if (!user) return next(new ApiError(400, 'User not found'));

      // users can revoke their own tokens and admins can revoke any tokens
      if (!req.user.ownsToken(refreshToken) && req.user.role !== Role.Admin)
        return next(new ApiError(401, 'Unauthorized'));

      const refreshTokenInDb = await Token.findOne({
        refreshToken,
        type: tokenTypes.REFRESH,
        blacklisted: false,
      });
      if (!refreshTokenInDb) return next(new ApiError(404, 'Not found'));

      await refreshTokenInDb.deleteOne();

      return res
        .status(200)
        .clearCookie('refreshToken', { httpOnly: true })
        .end();
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  postLogoutUserFromAllScreens: async (req, res, next) => {
    const token = req.body.token || req.cookies.refreshToken;

    try {
      if (!token) return next(new ApiError(400, 'Token is required'));

      if (!isValidId(req.user.id))
        return next(new ApiError(400, 'User not found'));

      const user = await User.findById(req.user.id);
      if (!user) return next(new ApiError(400, 'User not found'));

      // users can revoke their own tokens and admins can revoke any tokens
      if (!req.user.ownsToken(token) && req.user.role !== Role.Admin)
        return next(new ApiError(401, 'Unauthorized'));

      // return refresh tokens for user
      const refreshToken = await Token.find({
        user: req.user.id,
        type: tokenTypes.REFRESH,
        blacklisted: false,
      });

      if (!refreshToken) return next(new ApiError(404, 'Not found'));
      await Token.deleteMany({ refreshToken });

      return res
        .status(200)
        .clearCookie('refreshToken', { httpOnly: true })
        .end();
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  getNewTokens: async (req, res, next) => {
    const { refreshToken } = req.cookies;

    try {
      if (!refreshToken)
        return next(new ApiError(401, 'No refresh token provided'));

      const verifiedRefToken = await verifyDBToken(
        refreshToken,
        tokenTypes.REFRESH
      );

      const user = await User.findById(verifiedRefToken.user).exec();

      if (!user) return next(new ApiError(404, 'User not found'));

      const refTokenInDb = await Token.findOne({
        user: user.id,
        token: refreshToken,
      });

      if (!refTokenInDb)
        return next(new ApiError(401, 'Invalid refresh token'));

      await verifiedRefToken.deleteOne();

      const tokens = await generateAuthTokens(user);

      return res
        .cookie('refreshToken', tokens.refresh, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: tokens.refreshExpires * 1000, // always calculate time in milliseconds
          expires: new Date(Date.now() + tokens.refreshExpires * 1000), // always calculate time in milliseconds
          secure: false,
        })
        .header('Authorization', 'Bearer ' + tokens.access)
        .send({ accessToken: tokens.access });
      // .json({ user, tokens });
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
  getUserCredentials: async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return next(new ApiError(404, 'User not found'));

      const foundUser = await User.findById(user.id).select(
        '-password -acceptTerms -createdAt -updatedAt -__v'
      );
      if (!foundUser) return next(new ApiError(404, 'User not found'));

      res.status(200).send(foundUser);
    } catch (error) {
      console.log('error :>> ', error);
      next(error);
    }
  },
};
