import { Outlet } from 'react-router-dom';
import Header from '../components/Navbar';

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
