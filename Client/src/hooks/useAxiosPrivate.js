import { useEffect } from 'react';
import client, { privateClient } from '../api/axios';
import useStateContext from '../context';

const useAxiosPrivate = () => {
  const { auth, setAuth } = useStateContext();

  const refreshAccessTokenFn = async () => {
    const response = await client.get('refresh');
    const data = response?.data?.accessToken;

    setAuth(data);

    return data;
  };

  useEffect(() => {
    const requestIntercept = privateClient.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = privateClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        const errorStatus = error?.response?.status;
        if (
          errorStatus === 401 &&
          // error.response?.data?.message === 'Unauthorized! Token expired' &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refreshAccessTokenFn();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return privateClient(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      privateClient.interceptors.request.eject(requestIntercept);
      privateClient.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refreshAccessTokenFn]);

  return privateClient;
};

export default useAxiosPrivate;
