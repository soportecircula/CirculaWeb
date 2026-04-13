import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState } from './layout.models';

export const selectLayoutState = createFeatureSelector<LayoutState>('layout');

export const selectLayoutType = createSelector(
  selectLayoutState,
  (state) => state.LAYOUT,
);

export const selectLayoutTheme = createSelector(
  selectLayoutState,
  (state) => state.LAYOUT_THEME,
);

export const selectLayoutThemeColor = createSelector(
  selectLayoutState,
  (state) => state.LAYOUT_THEME_COLOR,
);

export const selectLayoutMode = createSelector(
  selectLayoutState,
  (state) => state.LAYOUT_MODE,
);

export const selectLayoutWidth = createSelector(
  selectLayoutState,
  (state) => state.LAYOUT_WIDTH,
);

export const selectLayoutPosition = createSelector(
  selectLayoutState,
  (state) => state.LAYOUT_POSITION,
);

export const selectTopbar = createSelector(
  selectLayoutState,
  (state) => state.TOPBAR,
);

export const selectSidebarSize = createSelector(
  selectLayoutState,
  (state) => state.SIDEBAR_SIZE,
);

export const selectSidebarColor = createSelector(
  selectLayoutState,
  (state) => state.SIDEBAR_COLOR,
);

export const selectSidebarImage = createSelector(
  selectLayoutState,
  (state) => state.SIDEBAR_IMAGE,
);

export const selectSidebarView = createSelector(
  selectLayoutState,
  (state) => state.SIDEBAR_VIEW,
);

export const selectSidebarVisibility = createSelector(
  selectLayoutState,
  (state) => state.SIDEBAR_VISIBILITY,
);

export const selectPreloader = createSelector(
  selectLayoutState,
  (state) => state.DATA_PRELOADER,
);

export const selectBackgroundImage = createSelector(
  selectLayoutState,
  (state) => state.BACKGROUND_IMAGE,
);
