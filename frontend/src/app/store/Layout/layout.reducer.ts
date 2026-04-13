import { createReducer, on } from '@ngrx/store';
import { LayoutState } from './layout.models';
import * as LayoutActions from './layout.actions';

const LAYOUT_STORAGE_KEY = 'layout_settings';

const defaultState: LayoutState = {
  LAYOUT: 'vertical',
  LAYOUT_THEME: 'default',
  LAYOUT_THEME_COLOR: 'default',
  LAYOUT_MODE: 'light',
  LAYOUT_WIDTH: 'fluid',
  LAYOUT_POSITION: 'fixed',
  TOPBAR: 'light',
  SIDEBAR_SIZE: 'lg',
  SIDEBAR_COLOR: 'dark',
  SIDEBAR_VIEW: 'default',
  SIDEBAR_VISIBILITY: 'show',
  SIDEBAR_IMAGE: 'none',
  DATA_PRELOADER: 'disable',
  BACKGROUND_IMAGE: 'none',
};

function loadFromStorage(): Partial<LayoutState> {
  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export const initialState: LayoutState = {
  ...defaultState,
  ...loadFromStorage(),
};

export const layoutReducer = createReducer(
  initialState,

  on(LayoutActions.changeLayout, (state, { layout }) => ({
    ...state,
    LAYOUT: layout,
  })),

  on(LayoutActions.changeTheme, (state, { theme }) => ({
    ...state,
    LAYOUT_THEME: theme,
  })),

  on(LayoutActions.changeThemeColor, (state, { themeColor }) => ({
    ...state,
    LAYOUT_THEME_COLOR: themeColor,
  })),

  on(LayoutActions.changeMode, (state, { mode }) => ({
    ...state,
    LAYOUT_MODE: mode,
  })),

  on(LayoutActions.changeLayoutWidth, (state, { layoutWidth }) => ({
    ...state,
    LAYOUT_WIDTH: layoutWidth,
  })),

  on(LayoutActions.changeLayoutPosition, (state, { layoutPosition }) => ({
    ...state,
    LAYOUT_POSITION: layoutPosition,
  })),

  on(LayoutActions.changeTopbar, (state, { topbarColor }) => ({
    ...state,
    TOPBAR: topbarColor,
  })),

  on(LayoutActions.changeSidebarSize, (state, { sidebarSize }) => ({
    ...state,
    SIDEBAR_SIZE: sidebarSize,
  })),

  on(LayoutActions.changeSidebarColor, (state, { sidebarColor }) => ({
    ...state,
    SIDEBAR_COLOR: sidebarColor,
  })),

  on(LayoutActions.changeSidebarImage, (state, { sidebarImage }) => ({
    ...state,
    SIDEBAR_IMAGE: sidebarImage,
  })),

  on(LayoutActions.changeSidebarView, (state, { sidebarView }) => ({
    ...state,
    SIDEBAR_VIEW: sidebarView,
  })),

  on(LayoutActions.changeSidebarVisibility, (state, { sidebarVisibility }) => ({
    ...state,
    SIDEBAR_VISIBILITY: sidebarVisibility,
  })),

  on(LayoutActions.changeDataPreloader, (state, { preloader }) => ({
    ...state,
    DATA_PRELOADER: preloader,
  })),

  on(LayoutActions.changeBackgroundImage, (state, { backgroundImage }) => ({
    ...state,
    BACKGROUND_IMAGE: backgroundImage,
  })),
);
