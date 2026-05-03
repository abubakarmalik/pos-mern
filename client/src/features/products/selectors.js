import { createSelector } from '@reduxjs/toolkit';

export const selectProductsState = (state) => state.products;

export const selectProducts = createSelector(
  [selectProductsState],
  (products) => products.items,
);

export const selectCurrentProduct = createSelector(
  [selectProductsState],
  (products) => products.currentItem,
);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (products) => products.isLoading,
);

export const selectCurrentProductLoading = createSelector(
  [selectProductsState],
  (products) => products.isLoadingCurrent,
);

export const selectProductSaving = createSelector(
  [selectProductsState],
  (products) => products.isCreating || products.isUpdating,
);

export const selectProductToggling = createSelector(
  [selectProductsState],
  (products) => products.isToggling,
);

export const selectProductsMessage = createSelector(
  [selectProductsState],
  (products) => products.message,
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (products) => products.error,
);
