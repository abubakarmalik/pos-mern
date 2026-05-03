import { createSelector } from '@reduxjs/toolkit';

export const selectSettingsState = (state) => state.settings;

export const selectSettings = createSelector(
  [selectSettingsState],
  (settings) => settings.item,
);

export const selectCurrencySymbol = createSelector(
  [selectSettings],
  (settings) => settings?.currencySymbol || 'PKR',
);

export const selectSettingsLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.isLoading,
);

export const selectSettingsSaving = createSelector(
  [selectSettingsState],
  (settings) => settings.isSaving,
);

export const selectSettingsMessage = createSelector(
  [selectSettingsState],
  (settings) => settings.message,
);

export const selectSettingsError = createSelector(
  [selectSettingsState],
  (settings) => settings.error,
);
