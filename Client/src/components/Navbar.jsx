import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../assets/react.svg';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import useStateContext from '../context';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Button } from 'react-bootstrap';

export default function Header() {
  const { auth, setAuth, setUser, clearUser, clearAuth } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutUserFn = async () => {
    const response = await axiosPrivate.get('logout');
    return response.data;
  };

  const { mutate: logoutUser } = useMutation(async () => await logoutUserFn(), {
    onSuccess: () => {
      clearUser('user');
      setAuth({});
      setUser({});
      clearAuth('token');
      navigate('/login');
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
  });

  const onLogoutHandler = async () => {
    logoutUser();
  };

  return (
    <Navbar className="bg-body-tertiary" fixed="top">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          <img
            alt=""
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          <span>React Bootstrap</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {Object.values(auth).length === 0 ? (
              <>
                {location?.pathname === '/register' ? (
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                ) : (
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                )}
              </>
            ) : (
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  className="btn-logout"
                  as={Button}
                  onClick={onLogoutHandler}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
