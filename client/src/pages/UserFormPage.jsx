import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import UserForm from '../components/users/UserForm';
import { createUser } from '../features/users/usersSlice';
import { selectUsersCreating } from '../features/users/selectors';

const defaultForm = {
  name: '',
  username: '',
  password: '',
  role: 'CASHIER',
};

const UserFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCreating = useSelector(selectUsersCreating);
  const [form, setForm] = useState(defaultForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createUser(form))
      .unwrap()
      .then(() => {
        toast.success('User created');
        navigate('/users');
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <UserForm
      form={form}
      isCreating={isCreating}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default UserFormPage;
