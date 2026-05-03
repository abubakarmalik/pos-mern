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

export const selectReportsLoading = createSelector(
  [selectReportsState],
  (reports) => reports.isLoadingToday || reports.isLoadingRange,
);

export const selectReportsError = createSelector(
  [selectReportsState],
  (reports) => reports.error,
);
