import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

export default function Loader() {
  return (
    <Container className="loader-container" fluid>
      <Box className="loader-box">
        <CircularProgress />
      </Box>
    </Container>
  );
}

function Box({ className, children }) {
  return <div className={className}>{children}</div>;
}

function CircularProgress({ className }) {
  return (
    <div className={className}>
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="dark" />
      <Spinner animation="grow" variant="light" />
    </div>
  );
}
