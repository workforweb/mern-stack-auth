import client from './axios';

export const signUpUserFn = async (user) => {
  const response = await client.post('signup', user);
  return response.data;
};

export const loginUserWithEmailFn = async (user) => {
  const response = await client.post('login/email', user);

  return response.data;
};

export const loginUserWithUsernameFn = async (user) => {
  const response = await client.post('login/username', user);
  return response.data;
};

export const loginUserWithPhoneFn = async (user) => {
  const response = await client.post('login/phone', user);
  return response.data;
};

export const refreshAccessTokenFn = async () => {
  const response = await client.get('refresh');
  return response.data;
};

export const getMeFn = async () => {
  const response = await client.get('me');
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await client.post('logout');
  return response.data;
};

export const logoutAllFn = async () => {
  const response = await client.post('revoke-all-tokens');
  return response.data;
};
