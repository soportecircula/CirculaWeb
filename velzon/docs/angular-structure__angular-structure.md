# Angular Structure

Fuente: https://themesbrand.com/velzon/docs/angular/angular-structure.html

---

#### Angular Structure

1. [Docs](javascript: void(0);)
2. Angular Structure

##### Overview

Index.html file Structure.

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Velzon - Angular 20 Responsive Admin Dashboard Template</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
</head>
<body>
    <app-root></app-root>
</body>
</html>
```

app.component.html file Structure.

```
<router-outlet></router-outlet>
```

app-routing.module.ts file Structure.

```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
    { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
    { path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

app.module.ts file Structure.

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule} from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { initFirebaseBackend } from './authUtils';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// store
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
    initFirebaseBackend(environment.firebaseConfig);
} else {
    FakeBackendInterceptor;
}

@NgModule({
    declarations: [
    AppComponent
    ],
    imports: [
    TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
        }
    }),
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([AuthenticationEffects
    ]),
  
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule
    ],

    providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Layout setup

* [<= v3.5.1](#v351Setup)
* [>= v4.0.0](#v400Setup)

You can set the default layout in the
`src/app/store/layouts/layout-reducers.ts` file.

```
export const initialState: LayoutState = {
 LAYOUT: LAYOUT_TYPES.SEMIBOX,
 LAYOUT_MODE: LAYOUT_MODE.LIGHTMODE,
 LAYOUT_WIDTH: LAYOUT_WIDTH_TYPES.FLUID,
 LAYOUT_POSITION: LAYOUT_POSITION_TYPES.FIXED,
 TOPBAR: LAYOUT_TOPBAR_COLOR_TYPES.LIGHT,
 SIDEBAR_COLOR: SIDEBAR_COLOR.LIGHT,
 SIDEBAR_SIZE: SIDEBAR_SIZE.LARGE,
 SIDEBAR_VIEW: SIDEBAR_VIEW.DEFAULT,
 SIDEBAR_IMAGE: SIDEBAR_IMAGE.NONE,
 SIDEBAR_VISIBILITY: SIDEBAR_VISIBILITY.SHOW,
 DATA_PRELOADER: PERLOADER_TYPES.DISABLE
}
```

|  |  |
| --- | --- |
| LAYOUT\_TYPES.VERTICAL | To set default layout as Vertical |
| LAYOUT\_TYPES.HORIZONTAL | To set default layout as Horizontal |
| LAYOUT\_TYPES.TWOCOLUMN | To set default layout as Two column |
| LAYOUT\_TYPES.SEMIBOX | To set default layout as Semibox |
| LAYOUT\_MODE.LIGHTMODE | To set Light layout mode. |
| LAYOUT\_MODE.DARKMODE | To set Dark layout mode. |
| LAYOUT\_WIDTH\_TYPES.FLUID | To set Dark layout mode. |
| LAYOUT\_WIDTH\_TYPES.BOXED | To set Dark layout mode. |
| SIDEBAR\_VISIBILITY.SHOW | To set sidebar show. |
| LAYOUT\_POSITION\_TYPES.FIXED | To set layout position Fixed. |
| LAYOUT\_POSITION\_TYPES.SCROLLABLE | To set layout position Scrollable. |
| LAYOUT\_TOPBAR\_COLOR\_TYPES.LIGHT | To set the Light color of Topbar. |
| LAYOUT\_TOPBAR\_COLOR\_TYPES.DARK | To set the dark color of Topbar. |
| SIDEBAR\_SIZE.LARGE | To set the Large left sidebar. |
| SIDEBAR\_SIZE.MEDIUM | To set the Compact left sidebar. |
| SIDEBAR\_SIZE.SMALL | To set the Icon view left sidebar. |
| SIDEBAR\_SIZE.SMALLHOVER | To set the Icon hover left sidebar. |
| SIDEBAR\_VIEW.DEFAULT | To set the Default layout. |
| SIDEBAR\_VIEW.DETACHED | To set the Detached layout. |
| SIDEBAR\_COLOR.LIGHT | To set the Light color of left Sidebar. |
| SIDEBAR\_COLOR.DARK | To set the Dark color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT | To set the Gradient color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT2 | To set the Gradient-2 color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT3 | To set the Gradient-3 color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT4 | To set the Gradient-4 color of left Sidebar. |
| SIDEBAR\_IMAGE.NONE | To Disable image on left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE1" | To set the img-1 Image of left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE2 | To set the img-2 Image of left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE3 | To set the img-3 Image of left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE4 | To set the img-4 Image of left Sidebar. |
| PERLOADER\_TYPES.ENABLE" | To enable the preloader on the Page. |
| PERLOADER\_TYPES.DISABLE | To disable the preloader on the Page. |

#### Galaxy Layout setup

You can set the default layout in the
`src/app/layouts/layout.model.ts` file.

```
export const LAYOUT = 'vertical';
export const LAYOUT_MODE = 'light';
export const LAYOUT_WIDTH = 'fluid';
export const LAYOUT_POSITION = 'fixed';
export const TOPBAR = 'light';
export const SIDEBAR_SIZE = 'lg';
export const SIDEBAR_VIEW = 'default';
export const SIDEBAR_COLOR = 'dark';
export const SIDEBAR_VISIBILITY = 'show';
export const DATA_PRELOADER = 'disable';
export const BODY_IMAGE = 'img-3';
```

|  |  |
| --- | --- |
| BODY\_IMAGE ="img-1" | To set img-1 on whole page(body). |
| BODY\_IMAGE ="img-2" | To set img-2 on whole page(body). |
| BODY\_IMAGE ="img-3" | To set img-3 on whole page(body). |
| BODY\_IMAGE="none" | To remove image on whole page(body). |

`Notes:`Above attributes works only
in Galaxy version layout.

You can set the default layout in the
`src/app/store/layouts/layout-reducers.ts` file.

```
export const initialState: LayoutState = {
    LAYOUT: LAYOUT_TYPES.VERTICAL,
    LAYOUT_THEME: LAYOUT_THEME.CREATIVE,
    LAYOUT_THEME_COLOR: LAYOUT_THEME_COLOR.DEFAULT,
    LAYOUT_MODE: LAYOUT_MODE.LIGHTMODE,
    LAYOUT_WIDTH: LAYOUT_WIDTH_TYPES.FLUID,
    LAYOUT_POSITION: LAYOUT_POSITION_TYPES.FIXED,
    TOPBAR: LAYOUT_TOPBAR_COLOR_TYPES.LIGHT,
    SIDEBAR_COLOR: SIDEBAR_COLOR.DARK,
    SIDEBAR_SIZE: SIDEBAR_SIZE.LARGE,
    SIDEBAR_VIEW: SIDEBAR_VIEW.DEFAULT,
    SIDEBAR_IMAGE: SIDEBAR_IMAGE.NONE,
    SIDEBAR_VISIBILITY: SIDEBAR_VISIBILITY.SHOW,
    DATA_PRELOADER: PERLOADER_TYPES.DISABLE,
    BACKGROUND_IMAGE: BACKGROUND_IMAGE.NONE,
}
```

|  |  |
| --- | --- |
| LAYOUT\_TYPES.VERTICAL | To set default layout as Vertical |
| LAYOUT\_TYPES.HORIZONTAL | To set default layout as Horizontal |
| LAYOUT\_TYPES.TWOCOLUMN | To set default layout as Two column |
| LAYOUT\_TYPES.SEMIBOX | To set default layout as Semibox |
| LAYOUT\_THEME.DEFAULT | To set default theme as Default |
| LAYOUT\_THEME.SAAS | To set saas theme as Saas |
| LAYOUT\_THEME.MATERIAL | To set material theme as Material |
| LAYOUT\_THEME.GALAXY | To set galaxy theme as Galaxy |
| LAYOUT\_THEME.CORPORATE | To set corporate theme as Corporate |
| LAYOUT\_THEME.MINIMAL | To set minimal theme as Minimal |
| LAYOUT\_THEME.CREATIVE | To set creative theme as Creative |
| LAYOUT\_THEME.MODERN | To set modern theme as Modern |
| LAYOUT\_THEME.INTERACTIVE | To set interactive theme as Interactive |
| LAYOUT\_THEME.CLASSIC | To set classic theme as Classic |
| LAYOUT\_THEME.VINTAGE | To set vintage theme as Vintage |
| LAYOUT\_MODE.LIGHTMODE | To set Light layout mode. |
| LAYOUT\_MODE.DARKMODE | To set Dark layout mode. |
| LAYOUT\_WIDTH\_TYPES.FLUID | To set Dark layout mode. |
| LAYOUT\_WIDTH\_TYPES.BOXED | To set Dark layout mode. |
| SIDEBAR\_VISIBILITY.SHOW | To set sidebar show. |
| LAYOUT\_POSITION\_TYPES.FIXED | To set layout position Fixed. |
| LAYOUT\_POSITION\_TYPES.SCROLLABLE | To set layout position Scrollable. |
| LAYOUT\_TOPBAR\_COLOR\_TYPES.LIGHT | To set the Light color of Topbar. |
| LAYOUT\_TOPBAR\_COLOR\_TYPES.DARK | To set the dark color of Topbar. |
| SIDEBAR\_SIZE.LARGE | To set the Large left sidebar. |
| SIDEBAR\_SIZE.MEDIUM | To set the Compact left sidebar. |
| SIDEBAR\_SIZE.SMALL | To set the Icon view left sidebar. |
| SIDEBAR\_SIZE.SMALLHOVER | To set the Icon hover left sidebar. |
| SIDEBAR\_VIEW.DEFAULT | To set the Default layout. |
| SIDEBAR\_VIEW.DETACHED | To set the Detached layout. |
| SIDEBAR\_COLOR.LIGHT | To set the Light color of left Sidebar. |
| SIDEBAR\_COLOR.DARK | To set the Dark color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT | To set the Gradient color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT2 | To set the Gradient-2 color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT3 | To set the Gradient-3 color of left Sidebar. |
| SIDEBAR\_COLOR.GRADIENT4 | To set the Gradient-4 color of left Sidebar. |
| SIDEBAR\_IMAGE.NONE | To Disable image on left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE1" | To set the img-1 Image of left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE2 | To set the img-2 Image of left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE3 | To set the img-3 Image of left Sidebar. |
| SIDEBAR\_IMAGE.IMAGE4 | To set the img-4 Image of left Sidebar. |
| PERLOADER\_TYPES.ENABLE" | To enable the preloader on the Page. |
| PERLOADER\_TYPES.DISABLE | To disable the preloader on the Page. |

#### Galaxy Layout setup

You can set the default layout in the
`src/app/layouts/layout.model.ts` file.

```
export const LAYOUT = 'vertical';
export const LAYOUT_MODE = 'light';
export const LAYOUT_WIDTH = 'fluid';
export const LAYOUT_POSITION = 'fixed';
export const TOPBAR = 'light';
export const SIDEBAR_SIZE = 'lg';
export const SIDEBAR_VIEW = 'default';
export const SIDEBAR_COLOR = 'dark';
export const SIDEBAR_VISIBILITY = 'show';
export const DATA_PRELOADER = 'disable';
export const BODY_IMAGE = 'img-3';
```

|  |  |
| --- | --- |
| BODY\_IMAGE ="img-1" | To set img-1 on whole page(body). |
| BODY\_IMAGE ="img-2" | To set img-2 on whole page(body). |
| BODY\_IMAGE ="img-3" | To set img-3 on whole page(body). |
| BODY\_IMAGE="none" | To remove image on whole page(body). |

`Notes:`Above attributes works only
in Galaxy version layout.
