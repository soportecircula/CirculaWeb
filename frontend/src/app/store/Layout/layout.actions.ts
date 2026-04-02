import { createAction, props } from '@ngrx/store';

export const changeLayout = createAction(
  '[Layout] Change Layout',
  props<{ layout: string }>(),
);

export const changeTheme = createAction(
  '[Layout] Change Theme',
  props<{ theme: string }>(),
);

export const changeThemeColor = createAction(
  '[Layout] Change Theme Color',
  props<{ themeColor: string }>(),
);

export const changeMode = createAction(
  '[Layout] Change Mode',
  props<{ mode: string }>(),
);

export const changeLayoutWidth = createAction(
  '[Layout] Change Layout Width',
  props<{ layoutWidth: string }>(),
);

export const changeLayoutPosition = createAction(
  '[Layout] Change Layout Position',
  props<{ layoutPosition: string }>(),
);

export const changeTopbar = createAction(
  '[Layout] Change Topbar',
  props<{ topbarColor: string }>(),
);

export const changeSidebarSize = createAction(
  '[Layout] Change Sidebar Size',
  props<{ sidebarSize: string }>(),
);

export const changeSidebarColor = createAction(
  '[Layout] Change Sidebar Color',
  props<{ sidebarColor: string }>(),
);

export const changeSidebarImage = createAction(
  '[Layout] Change Sidebar Image',
  props<{ sidebarImage: string }>(),
);

export const changeSidebarView = createAction(
  '[Layout] Change Sidebar View',
  props<{ sidebarView: string }>(),
);

export const changeSidebarVisibility = createAction(
  '[Layout] Change Sidebar Visibility',
  props<{ sidebarVisibility: string }>(),
);

export const changeDataPreloader = createAction(
  '[Layout] Change Data Preloader',
  props<{ preloader: string }>(),
);

export const changeBackgroundImage = createAction(
  '[Layout] Change Background Image',
  props<{ backgroundImage: string }>(),
);
