import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import UserFormModal from '../components/users/UserFormModal';
import UsersTable from '../components/users/UsersTable';
import { selectUser } from '../features/auth/authSelector';
import {
  clearUsersMessage,
  createUser,
  fetchUsers,
  toggleUser,
} from '../features/users/usersSlice';
import {
  selectUsers,
  selectUsersCreating,
  selectUsersError,
  selectUsersLoading,
  selectUsersMessage,
  selectUsersToggling,
} from '../features/users/selectors';

const defaultForm = {
  name: '',
  username: '',
  password: '',
  role: 'CASHIER',
};

const UsersPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersLoading);
  const isCreating = useSelector(selectUsersCreating);
  const isToggling = useSelector(selectUsersToggling);
  const error = useSelector(selectUsersError);
  const message = useSelector(selectUsersMessage);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(defaultForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createUser(form))
      .unwrap()
      .then(() => closeModal())
      .catch(() => {});
  };

  const handleToggle = (id) => {
    dispatch(toggleUser(id)).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Users</h2>
          <Button onClick={() => setModalOpen(true)}>Create User</Button>
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

      <UserFormModal
        form={form}
        isCreating={isCreating}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        open={modalOpen}
      />
    </div>
  );
};

export default UsersPage;
