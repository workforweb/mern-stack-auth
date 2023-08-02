import { Link, useNavigate } from 'react-router-dom';

export default function Unauthorize() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="unauthorize">
      <h1 className="h1 fw-medium text-danger">Oops!</h1>
      <p className="mt-2 fw-bold h2">Page Not Found</p>
      <div className="w-100 mt-4">
        <button className="btn btn-primary" onClick={goBack}>
          Go Back
        </button>
        <div className="mt-2">
          <span className="me-1">or</span>
          <Link className="fw-bold" to="/">
            Visit Our Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
