import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useStateContext from '../context';

export default function RequireAuth({ allowedRoles }) {
  const { user } = useStateContext();

  const location = useLocation();

  return allowedRoles?.includes(user?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
