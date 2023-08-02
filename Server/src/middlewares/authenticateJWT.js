import {
  verify,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import { tokenfromheader } from '../helpers/token-helper';
import ApiError from '../errors/ApiErrors';

const accessSecret =
  'yJzdWIiOiI2NDNiZGE2YmUyMjE1NTE0NDdlMTg2OTciLCJpYXQiOjE2ODE2NTIyODksImV4cCI6MTY';

const authenticateJWT = async (req, res, next) => {
  const token = await tokenfromheader(req);

  verify(token, accessSecret, (err, user) => {
    if (err instanceof TokenExpiredError) {
      return next(new ApiError(401, 'Unauthorized! Token expired'));
    }
    if (err instanceof NotBeforeError) {
      return next(new ApiError(401, 'jwt not active'));
    }
    if (err instanceof JsonWebTokenError) {
      return next(new ApiError(401, 'jwt malformed'));
    }
    req.user = user;
    next();
  });
};

export default authenticateJWT;
