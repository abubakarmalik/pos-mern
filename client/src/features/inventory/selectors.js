import { createSelector } from '@reduxjs/toolkit';

export const selectInventoryState = (state) => state.inventory;

export const selectInventoryAdjusting = createSelector(
  [selectInventoryState],
  (inventory) => inventory.isAdjusting,
);

export const selectInventoryMessage = createSelector(
  [selectInventoryState],
  (inventory) => inventory.message,
);

export const selectInventoryError = createSelector(
  [selectInventoryState],
  (inventory) => inventory.error,
);
