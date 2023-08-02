import User from '../models/user-model';
import Token from '../models/token-model';
import ApiError from '../errors/ApiErrors';
import { tokenfromheader, verifyAccessToken } from '../helpers/token-helper';

const AccessTo = (roles = []) => {
  /*
   * roles param can be a single role string (e.g. Role.User or 'User')
   * or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
   */

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    /* 
    *  authenticate JWT token and attach user to request object (req.user)
    !  Please note: work only when AuthMiddleware already attach with any route
    *  authorize based on user role
    */

    async (req, res, next) => {
      const token = await tokenfromheader(req);

      if (!token) return next(new ApiError(401, 'Access Denied'));

      const payload = await verifyAccessToken(token);

      if (typeof payload.exp === 'undefined') {
        return next(new ApiError(403, 'not logged in'));
      }

      const { sub } = payload;
      const user = await User.findById(sub);

      if (!user) return next(new ApiError(401, 'User not found'));

      // user's role is not authorized
      if (!user || (roles.length && !roles.includes(user.role)))
        return next(new ApiError(401, 'Unauthorized'));

      // authentication and authorization successful
      req.user = user;
      req.user.role = user.role;

      const refreshTokens = await Token.find({ user: user.id }).populate(
        'user'
      );

      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);

      next();
    },
  ];
};

export default AccessTo;

// router.get('/users', authorize([Roles.ADMIN]), getAll); // admin only can see all users

// router.get('/users/:id', authorize(), getById);       // all authenticated users pass empty or pass [Roles.USER,Roles.ADMIN]
