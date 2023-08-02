import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { signUpUserFn } from '../api/http';

import { registerSchema } from '../validation/yupValidation';

export default function Register() {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange', // or 'onBlur'
    resolver: yupResolver(registerSchema),
  });

  // ? Calling the Register Mutation
  const { mutate, isLoading } = useMutation(
    (userData) => signUpUserFn(userData),
    {
      onSuccess(data) {
        toast.success(data?.message);
        navigate('/login');
      },
      onError(error) {
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((el) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error(error.response.data.message, {
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
    // ? Execute the Mutation
    mutate(values);
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      <h1 className="h1 text-center fw-bold mb-2 text-primary">
        Welcome to <br />
        <span className="public-h1-span">Mentor Inc.</span>
      </h1>
      <h2 className="text-center mb-2">Sign Up To Get Started!</h2>
      <form
        className="text-start"
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="off"
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.name ? 'border border-danger' : ''
            }`}
            id="name"
            aria-describedby="nameHelp"
            {...register('name')}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.username ? 'border border-danger' : ''
            }`}
            id="username"
            aria-describedby="usernameHelp"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.phone ? 'border border-danger' : ''
            }`}
            id="phone"
            aria-describedby="phoneHelp"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-danger">{errors.phone.message}</p>
          )}
        </div>

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
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-danger">{errors.email.message}</p>
          ) : (
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          )}
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
            {...register('password')}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password2" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmPassword ? 'border border-danger' : ''
            }`}
            id="password2"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className={`form-check-input ${
              errors.acceptTerms ? 'border border-danger' : ''
            }`}
            id="checkbox"
            {...register('acceptTerms')}
          />
          <label className="form-check-label" htmlFor="checkbox">
            {errors.acceptTerms ? (
              <p className="text-danger">{errors.acceptTerms.message}</p>
            ) : (
              <p>
                I accept
                <span
                  role="button"
                  tabIndex="0"
                  className="text-primary fw-bold ps-1"
                >
                  terms of use
                </span>
              </p>
            )}
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Submit
        </button>
      </form>
      <div className="login-footer">
        Already have an account?
        <Link className="btn btn-link" to="/login">
          Login Here
        </Link>
      </div>
    </div>
  );
}
