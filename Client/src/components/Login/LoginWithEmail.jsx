import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useStateContext from '../../context';
import { loginwithEmailSchema } from '../../validation/yupValidation';
import client from '../../api/axios';

export default function LoginWithEmail() {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange', // or 'onBlur'
    resolver: yupResolver(loginwithEmailSchema),
  });

  const { setAuth } = useStateContext();

  const loginUserWithEmailFn = async (user) => {
    const response = await client.post('login/email', user);

    return response.data;
  };

  //  API Login Mutation
  const { mutate: loginUser, isLoading } = useMutation(
    (userData) => loginUserWithEmailFn(userData),
    {
      onSuccess: (data) => {
        toast.success('You successfully logged in');
        setAuth(data?.accessToken);
        navigate('/');
      },
      onError: (error) => {
        if (Array.isArray(error?.response?.data?.error)) {
          error?.response?.data?.error.forEach((el) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error(error?.response?.data?.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    // ? Executing the loginUser Mutation
    loginUser(values);
  };

  return (
    <form
      className="text-start form-container"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      autoComplete="off"
    >
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="text"
          className={`form-control ${
            errors.email ? 'border border-danger' : ''
          }`}
          id="email"
          aria-describedby="emailHelp"
          placeholder="Email"
          {...register('email')}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="password1" className="form-label">
          Password
        </label>
        <input
          type="password"
          className={`form-control ${
            errors.password ? 'border border-danger' : ''
          }`}
          id="password1"
          placeholder="Password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
