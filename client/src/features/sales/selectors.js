import { createSelector } from '@reduxjs/toolkit';

export const selectSalesState = (state) => state.sales;

export const selectSales = createSelector(
  [selectSalesState],
  (sales) => sales.items,
);

export const selectSalesPagination = createSelector(
  [selectSalesState],
  (sales) => sales.pagination,
);

export const selectCurrentSale = createSelector(
  [selectSalesState],
  (sales) => sales.currentItem,
);

export const selectLastCreatedSale = createSelector(
  [selectSalesState],
  (sales) => sales.lastCreatedItem,
);

export const selectSalesLoading = createSelector(
  [selectSalesState],
  (sales) => sales.isLoading,
);

export const selectCurrentSaleLoading = createSelector(
  [selectSalesState],
  (sales) => sales.isLoadingCurrent,
);

export const selectSaleCreating = createSelector(
  [selectSalesState],
  (sales) => sales.isCreating,
);

export const selectSaleRefunding = createSelector(
  [selectSalesState],
  (sales) => sales.isRefunding,
);

export const selectSalesMessage = createSelector(
  [selectSalesState],
  (sales) => sales.message,
);

export const selectSalesError = createSelector(
  [selectSalesState],
  (sales) => sales.error,
);
