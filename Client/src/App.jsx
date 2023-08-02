import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

import PublicPage from './pages/public';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import ProfilePage from './pages/profile';
import RegisterPage from './pages/register';
import UnauthorizePage from './pages/unauthorize';

import './App.css';
import RequireAuth from './utils/RequireAuth';
import Role from './config/roles';
import useStateContext from './context';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateOutlet />}>
            <Route index element={<PublicPage />} />
          </Route>
          <Route element={<Anonymous />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(Role)]} />}
          >
            <Route element={<PrivateOutlet />}>
              <Route path="home" element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path={'*'} element={<UnauthorizePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

function PrivateOutlet() {
  const { auth } = useStateContext();
  return Object.values(auth).length !== 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

function PrivateOutlet2() {
  const { auth } = useStateContext();
  return Object.values(auth).length !== 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

const Anonymous = () => {
  const { auth } = useStateContext();

  return Object.values(auth).length !== 0 ? (
    <Navigate to="/" replace={true} />
  ) : (
    <Outlet />
  );
};
