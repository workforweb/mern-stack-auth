import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
import LoginWithEmail from '../components/Login/LoginWithEmail';
import LoginWithPhone from '../components/Login/LoginWithPhone';
import LoginWithUsername from '../components/Login/LoginWithUsername';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from 'react-router-dom';

export default function login() {
  const [selected, setSelected] = useLocalStorage('option', 'email');

  useEffect(() => {
    if (selected === '') {
      setSelected('email');
    } else if (
      selected &&
      selected !== 'email' &&
      selected !== 'phone' &&
      selected !== 'username'
    ) {
      setSelected('email');
    }
  }, [selected]);

  return (
    <div className="mt-2">
      <h1 className="text-center fw-bold mb-2 text-primary">Welcome Back!</h1>
      <h2 className="text-center mb-2">Login to have access!</h2>

      <div className="choose-option my-3">Choose an option</div>
      <div className="btns-group">
        <Button
          className={selected === 'email' ? 'btn-info' : ''}
          onClick={() => setSelected('email')}
        >
          Email
        </Button>
        <Button
          className={selected === 'phone' ? ' btn-info' : ''}
          onClick={() => setSelected('phone')}
        >
          Phone
        </Button>
        <Button
          className={selected === 'username' ? 'btn-info' : ''}
          onClick={() => setSelected('username')}
        >
          Username
        </Button>
      </div>
      <div>
        {selected === 'email' && <LoginWithEmail />}
        {selected === 'phone' && <LoginWithPhone />}
        {selected === 'username' && <LoginWithUsername />}
      </div>
      <div className="login-footer">
        Need an account?
        <Link className="btn btn-link" to="/register">
          Register Here
        </Link>
      </div>
    </div>
  );
}
