import useStateContext from '../context';

export default function Profile() {
  const { user } = useStateContext();

  return (
    <div>
      <div>Profile Page</div>
      <div>
        <strong>Id:</strong> {user?.id}
      </div>
      <div>
        <strong>Full Name:</strong> {user?.name}
      </div>
      <div>
        <strong>Email Address:</strong> {user?.email}
      </div>
      <div>
        <strong>Role:</strong> {user?.role}
      </div>
    </div>
  );
}
