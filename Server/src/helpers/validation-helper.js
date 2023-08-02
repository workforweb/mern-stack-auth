import Role from '../config/roles';
import customJoi from '../utils/customJoi';

export const checkPassword = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message({
      custom: 'password must be at least 8 characters',
    });
  } else if (
    !value.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
    )
  ) {
    return helpers.message({
      custom:
        'Atleast 1 letter, 1 number, 1 special character and SHOULD NOT start with a special character',
    });
  }
  return value;
};

export const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

export const id = customJoi.string().custom(objectId);

export const email = customJoi.string();

export const password = customJoi.string().required();

export const confirmPassword = customJoi
  .string()
  .valid(customJoi.ref('password'))
  .required()
  .messages({ 'any.only': 'Both passwords must match' });

// .label('Confirm password')
// .options({ messages: { 'any.only': 'Both passwords must match' } });
// .messages({ 'any.only': '{{#label}} does not match' });

export const name = customJoi.string().required();

export const username = customJoi
  .string()
  .pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
  .messages({ 'string.pattern.base': 'At least 1 letter and 1 number' });

export const phone = customJoi
  .string()
  .length(10)
  .pattern(/[6-9]{1}[0-9]{9}/)
  .messages({ 'string.pattern.base': 'Not a valid phone number' });

export const token = customJoi.string().required();

export const refreshToken = customJoi.string().required();

export const revokeToken = customJoi.string().empty('');

export const acceptTerms = customJoi
  .boolean()
  .valid(true)
  .required()
  .messages({ 'any.only': 'Please accept terms' });

export const role = customJoi.string().valid(Role.Admin, Role.User).required();

export const ObjectKeys = (keys) => {
  return customJoi.object().keys({ ...keys });
};

// name: J.name,
//     email: J.email.email(),
//     password: J.password.custom(J.checkPassword),
//     confirmPassword: J.confirmPassword,
//     acceptTerms: J.acceptTerms,
//     role: J.role,

export const UpdName = customJoi.string().empty('');
export const UpdEmail = customJoi.string().empty('');
export const UpdPassword = customJoi.string().empty('');
export const UpdConfirmPassword = customJoi
  .string()
  .valid(customJoi.ref('password'))
  .messages({ 'any.only': 'Both passwords must match' })
  .empty('');
export const UpdRole = customJoi
  .string()
  .valid(Role.Admin, Role.User)
  .empty('');

// const validation = joi.object({
//   userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
//   email: joi.string().email().trim(true).required(),
//   password: joi.string().min(8).trim(true).required(),
//   mobileNumber: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
//   birthYear: joi.number().integer().min(1920).max(2000),
//   skillSet: joi.array().items(joi.string().alphanum().trim(true))
// .default([]),
//  is_active: joi.boolean().default(true),

// export const lessonSchema = Joi.object().keys({
//   courseId: Joi.number().integer().required(),
//   url: Joi.string().trim().uri().required(),
//   description: Joi.string().trim(),
//   thumbnailUrl: Joi.string().uri(),
//   title: Joi.string().trim().required(),
//   duration: Joi.string(),
//   seqNo: Joi.number(),
//   createdAt: Joi.date(),
//   updatedAt: Joi.date()
// });
