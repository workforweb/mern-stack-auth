// import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useStateContext from '../context';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function Public() {
  const axiosPrivate = useAxiosPrivate();
  const { user, setUser } = useStateContext();

  const getMeFn = async () => {
    const response = await axiosPrivate.get('me');
    return response.data;
  };

  // API Get Current Logged-in user
  useQuery(['authUser'], getMeFn, {
    enabled: user !== null,
    select: (data) => data,
    retry: 1,
    onSuccess: (data) => {
      setUser(data);
    },
  });
  return (
    <section className="public">
      <header className="public-header">
        <h1 className="h2 fw-medium text-primary-emphasis text-opacity-25">
          Welcome to <span className="public-h1-span">Mentor Inc.</span>
        </h1>
      </header>
      <main className="public-main">
        <p className="container">
          Located in the beautiful downtown Food City, Mentor Inc. provides
          trained personnel, includes well organized team that is dedicated to
          catering to your technical repair needs.
        </p>
        <address className="public-address">
          <div className="d-block">Mentor inc.</div>
          <div className="d-block">555 Foo Drive</div>
          <div className="d-block">Foo City, CA 12345</div>
          <div className="d-block">
            <a href="tel:+15555555555">(555) 555-5555</a>
          </div>
        </address>
        <p className="d-block">Owner: Mentor Max</p>
      </main>
    </section>
  );
}
