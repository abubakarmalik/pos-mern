import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PageHeader from '../components/ui/PageHeader';
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
  const [pendingToggle, setPendingToggle] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!message) return;
    toast.success(message);
    dispatch(clearUsersMessage());
  }, [dispatch, message]);

  const handleToggle = () => {
    dispatch(toggleUser(pendingToggle.id))
      .unwrap()
      .catch((toggleError) => toast.error(toggleError.message))
      .finally(() => setPendingToggle(null));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        description="Manage staff access and role status."
        actions={
          <Link to="/users/new">
            <Button leftIcon={<FiPlus />}>Create User</Button>
          </Link>
        }
      />

      <Card>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <UsersTable
          currentUser={currentUser}
          isLoading={isLoading}
          isToggling={isToggling}
          onToggle={setPendingToggle}
          users={users}
        />
      </Card>
      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={`${pendingToggle?.isActive ? 'Disable' : 'Enable'} user?`}
        description="This changes whether the user can sign in and access the dashboard."
        confirmLabel={pendingToggle?.isActive ? 'Disable user' : 'Enable user'}
        loadingLabel="Updating..."
        variant={pendingToggle?.isActive ? 'danger' : 'primary'}
        loading={isToggling}
        onCancel={() => setPendingToggle(null)}
        onConfirm={handleToggle}
      />
    </div>
  );
};

export default UsersPage;
