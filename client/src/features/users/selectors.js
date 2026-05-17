import { createSelector } from '@reduxjs/toolkit';

export const selectUsersState = (state) => state.users;

export const selectUsers = createSelector(
  [selectUsersState],
  (users) => users.items,
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (users) => users.isLoading,
);

export const selectUsersCreating = createSelector(
  [selectUsersState],
  (users) => users.isCreating,
);

export const selectUsersToggling = createSelector(
  [selectUsersState],
  (users) => users.isToggling,
);

export const selectUsersMessage = createSelector(
  [selectUsersState],
  (users) => users.message,
);

export const selectUsersError = createSelector(
  [selectUsersState],
  (users) => users.error,
);
