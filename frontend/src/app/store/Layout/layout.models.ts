export const LAYOUT_TYPES = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;

export const LAYOUT_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const LAYOUT_WIDTHS = {
  FLUID: 'fluid',
  BOXED: 'boxed',
} as const;

export const LAYOUT_POSITIONS = {
  FIXED: 'fixed',
  SCROLLABLE: 'scrollable',
} as const;

export const TOPBAR_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const SIDEBAR_SIZES = {
  LG: 'lg',
  MD: 'md',
  SM: 'sm',
  SM_HOVER: 'sm-hover',
} as const;

export const SIDEBAR_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
  GRADIENT: 'gradient',
  GRADIENT_2: 'gradient-2',
  GRADIENT_3: 'gradient-3',
  GRADIENT_4: 'gradient-4',
} as const;

export const SIDEBAR_VIEWS = {
  DEFAULT: 'default',
  DETACHED: 'detached',
} as const;

export const SIDEBAR_VISIBILITIES = {
  SHOW: 'show',
  HIDDEN: 'hidden',
} as const;

export const DATA_PRELOADERS = {
  ENABLE: 'enable',
  DISABLE: 'disable',
} as const;

export interface LayoutState {
  LAYOUT: string;
  LAYOUT_THEME: string;
  LAYOUT_THEME_COLOR: string;
  LAYOUT_MODE: string;
  LAYOUT_WIDTH: string;
  LAYOUT_POSITION: string;
  TOPBAR: string;
  SIDEBAR_SIZE: string;
  SIDEBAR_COLOR: string;
  SIDEBAR_VIEW: string;
  SIDEBAR_VISIBILITY: string;
  SIDEBAR_IMAGE: string;
  DATA_PRELOADER: string;
  BACKGROUND_IMAGE: string;
}
