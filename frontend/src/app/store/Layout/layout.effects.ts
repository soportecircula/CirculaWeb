import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { selectLayoutState } from './layout.selectors';
import * as LayoutActions from './layout.actions';

const LAYOUT_STORAGE_KEY = 'layout_settings';

@Injectable()
export class LayoutEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  persistLayout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          LayoutActions.changeLayout,
          LayoutActions.changeTheme,
          LayoutActions.changeThemeColor,
          LayoutActions.changeMode,
          LayoutActions.changeLayoutWidth,
          LayoutActions.changeLayoutPosition,
          LayoutActions.changeTopbar,
          LayoutActions.changeSidebarSize,
          LayoutActions.changeSidebarColor,
          LayoutActions.changeSidebarImage,
          LayoutActions.changeSidebarView,
          LayoutActions.changeSidebarVisibility,
          LayoutActions.changeDataPreloader,
          LayoutActions.changeBackgroundImage,
        ),
        withLatestFrom(this.store.select(selectLayoutState)),
        tap(([, layoutState]) => {
          localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutState));
        }),
      ),
    { dispatch: false },
  );
}
