import * as yup from 'yup';

const isNameValid = yup
  .string()
  .required('Name is required')
  .matches(/^\S.*[^.\s]$/, 'No white space allowed')
  .min(5, 'must be at least 5 characters long')
  .max(30, 'must be upto 30 characters long')
  .matches(/^[ a-zA-Z\']+$/, 'Only use letters, space, and single quote');

const isUsernameValid = yup
  .string()
  .required('Username is required')
  .matches(/^[^\s].+[^\s]$/, 'No white space allowed')
  .matches(
    /^[a-z0-9_.]+$/,
    'Only use lowercase letters, numbers, underscores, and periods.'
  )
  .min(8, 'must be at least 8 characters long')
  .max(30, 'must be upto 30 characters long');

const isEmailValid = yup
  .string()
  .required('Email is required')
  .matches(/^[^\s].+[^\s]$/, 'No white space allowed')
  .email('Must be a valid email address')
  .matches(/[^\s@]+@[^\s@]+\.[^\s@]+/gi, 'Not a valid email address');

const isPhoneValid = yup
  .string()
  .required('Phone number is required')
  .matches(/^[^\s].+[^\s]$/, 'No white space allowed')
  .matches(/[6-9]{1}[0-9]{9}/, 'Need an indian phone number')
  .max(10, 'Only 10 digits allowed without country code');

const isPasswordValid = yup
  .string()
  .required('Password is required')
  .matches(/^[^\s].+[^\s]$/, 'No white space allowed')
  .min(8, 'Password at least 8 characters long')
  .max(30, 'Password max limit is 30 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
    'Atleast 1 letter, 1 number, 1 special character and SHOULD NOT start with a special character'
  );

const isMatchWithPassword = yup
  .string()
  .required('Confirm Password is required')
  .oneOf([yup.ref('password'), null], 'Passwords must match');

const isTermsAccepted = yup
  .boolean()
  .oneOf([true], 'You must accept terms of use')
  .required('You must accept terms of use');

export const registerSchema = yup.object().shape({
  name: isNameValid,
  username: isUsernameValid,
  email: isEmailValid,
  phone: isPhoneValid,
  password: isPasswordValid,
  confirmPassword: isMatchWithPassword,
  acceptTerms: isTermsAccepted,
});

export const loginwithEmailSchema = yup.object().shape({
  email: isEmailValid,
  password: isPasswordValid,
});

export const loginwithPhoneSchema = yup.object().shape({
  phone: isPhoneValid,
  password: isPasswordValid,
});

export const loginwithUsernameSchema = yup.object().shape({
  username: isUsernameValid,
  password: isPasswordValid,
});
