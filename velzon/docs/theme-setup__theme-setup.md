# Theme Setup

Fuente: https://themesbrand.com/velzon/docs/angular/theme-setup.html

---

#### Theme Setup

1. [Docs](javascript: void(0);)
2. Theme Setup

#### How to use pre-built Theme using Master folder?

Each of the theme configuration options is provided Below, you can change their values as per you need in initialState variable
located in `src/app/store/layouts/layout-reducers.ts` file.

**Note :** if you are going to update any object property of ngOnInit,
make sure you use option's corresponding constant
given in `src/app/store/layouts/layout-reducers.ts`(Please do not change the constant"s value in `src/app/store/layout/layout.ts` ) file.

```
// IntialState
export const initialState: LayoutState = {
    LAYOUT: LAYOUT_TYPES.VERTICAL,
    LAYOUT_THEME: LAYOUT_THEME.DEFAULT,
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

![image](https://themesbrand.com/velzon/assets/images/demo/default.png)
`LAYOUT_THEME.DEFAULT`

![image](https://themesbrand.com/velzon/assets/images/demo/saas.png)
`LAYOUT_THEME.SAAS`

![image](https://themesbrand.com/velzon/assets/images/demo/material.png)
`LAYOUT_THEME.MATERIAL`

![image](https://themesbrand.com/velzon/assets/images/demo/galaxy.png)
`LAYOUT_THEME.GALAXY`

![image](https://themesbrand.com/velzon/assets/images/demo/corporate.png)
`LAYOUT_THEME.CORPORATE`

![image](https://themesbrand.com/velzon/assets/images/demo/minimal.png)
`LAYOUT_THEME.MINIMAL`

![image](https://themesbrand.com/velzon/assets/images/demo/creative.png)
`LAYOUT_THEME.CREATIVE`

![image](https://themesbrand.com/velzon/assets/images/demo/modern.png)
`LAYOUT_THEME.MODERN`

![image](https://themesbrand.com/velzon/assets/images/demo/interactive.png)
`LAYOUT_THEME.INTERACTIVE`

![image](https://themesbrand.com/velzon/assets/images/demo/classic.png)
`LAYOUT_THEME.CLASSIC`

![image](https://themesbrand.com/velzon/assets/images/demo/vintage.png)
`LAYOUT_THEME.VINTAGE`
