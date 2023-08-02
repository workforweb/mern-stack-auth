import authController from '../controllers/auth-controller';
import JoiValidate from '../middlewares/JoiValidate';
import authValidation from '../validation/auth-validation';
import AccessTo from '../middlewares/AuthRights';
import { isLoggedIn } from '../middlewares';
import authenticateJWT from '../middlewares/authenticateJWT';

export default (app) => {
  app.post(
    '/signup',
    JoiValidate(authValidation.register),
    authController.postRegisterUser
  );

  app.post(
    '/login/email',
    JoiValidate(authValidation.loginWithEmail),
    authController.postLoginUserWithEmail
  );

  app.post(
    '/login/username',
    JoiValidate(authValidation.loginWithUsername),
    authController.postLoginUserWithUsername
  );

  app.post(
    '/login/phone',
    JoiValidate(authValidation.loginWithPhone),
    authController.postLoginUserWithPhone
  );

  app.get('/logout', isLoggedIn, authController.postLogoutUser);
  app.post(
    '/revoke-all-tokens',
    isLoggedIn,
    authController.postLogoutUserFromAllScreens
  );
  app.get('/refresh', isLoggedIn, authController.getNewTokens);

  app.get(
    '/me',
    authenticateJWT,
    isLoggedIn,
    AccessTo(),
    authController.getUserCredentials
  );
};
