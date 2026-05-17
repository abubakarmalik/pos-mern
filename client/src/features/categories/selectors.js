import { createSelector } from '@reduxjs/toolkit';

export const selectCategoriesState = (state) => state.categories;

export const selectCategories = createSelector(
  [selectCategoriesState],
  (categories) => categories.items,
);

export const selectCurrentCategory = createSelector(
  [selectCategoriesState],
  (categories) => categories.currentItem,
);

export const selectCategoriesLoading = createSelector(
  [selectCategoriesState],
  (categories) => categories.isLoading,
);

export const selectCurrentCategoryLoading = createSelector(
  [selectCategoriesState],
  (categories) => categories.isLoadingCurrent,
);

export const selectCategorySaving = createSelector(
  [selectCategoriesState],
  (categories) => categories.isCreating || categories.isUpdating,
);

export const selectCategoryToggling = createSelector(
  [selectCategoriesState],
  (categories) => categories.isToggling,
);

export const selectCategoriesMessage = createSelector(
  [selectCategoriesState],
  (categories) => categories.message,
);

export const selectCategoriesError = createSelector(
  [selectCategoriesState],
  (categories) => categories.error,
);
