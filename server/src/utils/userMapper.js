const mapUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

module.exports = { mapUser };
