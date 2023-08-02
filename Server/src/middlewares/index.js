import tokenTypes from '../config/tokenTypes';
import ApiError from '../errors/ApiErrors';
import { verifyDBToken } from '../helpers/token-helper';
import Token from '../models/token-model';
import User from '../models/user-model';

export const isLoggedIn = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return next(new ApiError(401, 'No refresh token provided'));

    const verifiedRefToken = await verifyDBToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    if (!verifiedRefToken) return next(new ApiError(404, 'Token not found'));

    const user = await User.findById(
      verifiedRefToken.user,
      'acceptTerms role _id'
    ).exec();

    if (!user.acceptTerms || user.acceptTerms !== true)
      return next(new ApiError(404, 'user not found'));

    req.user = user;

    const refreshTokens = await Token.find({ user: req.user.id }).populate(
      'user'
    );

    req.user.ownsToken = (token) =>
      !!refreshTokens.find((x) => x.token === token);

    next();
  } catch (error) {
    next(error);
  }
};
