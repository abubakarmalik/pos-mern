import { createSelector } from '@reduxjs/toolkit';

export const selectReportsState = (state) => state.reports;

export const selectTodaySummary = createSelector(
  [selectReportsState],
  (reports) => reports.todaySummary,
);

export const selectRangeSummary = createSelector(
  [selectReportsState],
  (reports) => reports.rangeSummary,
);

export const selectTopProductsReport = createSelector(
  [selectReportsState],
  (reports) => reports.topProducts,
);

export const selectLowStockProductsReport = createSelector(
  [selectReportsState],
  (reports) => reports.lowStockProducts,
);

export const selectSalesByDateReport = createSelector(
  [selectReportsState],
  (reports) => reports.salesByDate,
);

export const selectSalesByPaymentMethodReport = createSelector(
  [selectReportsState],
  (reports) => reports.salesByPaymentMethod,
);

export const selectCashierPerformanceReport = createSelector(
  [selectReportsState],
  (reports) => reports.cashierPerformance,
);

export const selectInventoryMovementReport = createSelector(
  [selectReportsState],
  (reports) => reports.inventoryMovement,
);

export const selectReportsLoading = createSelector(
  [selectReportsState],
  (reports) => reports.isLoadingToday || reports.isLoadingRange,
);

export const selectReportsError = createSelector(
  [selectReportsState],
  (reports) => reports.error,
);
