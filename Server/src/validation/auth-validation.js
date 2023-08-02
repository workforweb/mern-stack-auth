import * as J from '../helpers/validation-helper';

export default {
  register: {
    body: J.ObjectKeys({
      name: J.name.min(5).max(30).trim(true).escapeHTML().required(),
      username: J.username.min(8).max(30).trim(true).escapeHTML().required(),
      phone: J.phone.trim(true).escapeHTML().required(),
      email: J.email.email().trim(true).escapeHTML().required(),
      password: J.password
        .custom(J.checkPassword)
        .min(8)
        .max(30)
        .trim(true)
        .escapeHTML()
        .required(),
      confirmPassword: J.confirmPassword.trim(true).escapeHTML().required(),
      acceptTerms: J.acceptTerms.required(),
    }),
  },
  loginWithEmail: {
    body: J.ObjectKeys({
      email: J.email.email().trim(true).escapeHTML().optional(),
      password: J.password.min(8).max(30).trim(true).escapeHTML(),
    }),
  },
  loginWithUsername: {
    body: J.ObjectKeys({
      username: J.username.min(8).max(30).trim(true).escapeHTML().optional(),
      password: J.password.min(8).max(30).trim(true).escapeHTML(),
    }),
  },
  loginWithPhone: {
    body: J.ObjectKeys({
      phone: J.phone.trim(true).escapeHTML().optional(),
      password: J.password.min(8).max(30).trim(true).escapeHTML(),
    }),
  },
};
