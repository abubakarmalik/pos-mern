import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import UsersTable from '../components/users/UsersTable';
import { selectUser } from '../features/auth/authSelector';
import {
  clearUsersMessage,
  fetchUsers,
  toggleUser,
} from '../features/users/usersSlice';
import {
  selectUsers,
  selectUsersError,
  selectUsersLoading,
  selectUsersMessage,
  selectUsersToggling,
} from '../features/users/selectors';

const UsersPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersLoading);
  const isToggling = useSelector(selectUsersToggling);
  const error = useSelector(selectUsersError);
  const message = useSelector(selectUsersMessage);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearUsersMessage());
  }, [dispatch, error]);

  useEffect(() => {
    if (!message) return;
    toast.success(message);
    dispatch(clearUsersMessage());
  }, [dispatch, message]);

  const handleToggle = (id) => {
    dispatch(toggleUser(id)).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Users</h2>
          <Link to="/users/new">
            <Button>Create User</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <UsersTable
          currentUser={currentUser}
          isLoading={isLoading}
          isToggling={isToggling}
          onToggle={handleToggle}
          users={users}
        />
      </div>
    </div>
  );
};

export default UsersPage;
