# Vertical

Fuente: https://themesbrand.com/velzon/docs/angular/vertical.html

---

#### Vertical

1. [Docs](javascript: void(0);)
2. Vertical

#### How to use pre-built layouts?

Each of the layout options is provided below with steps you
would need to perform in `src/app/store/layouts/layout-reducers.ts`
folder.

#### Theme Options

**Note :** if you are going to update any object property of ngOnInit,
make sure you use option's corresponding constant
given in `src/app/store/layouts/layout-reducers.ts`(Please do not change the constant"s value in `src/app/store/layout/layout.ts` ) file.

```
    // IntialState
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

#### Layout Width

![image](../assets/images/layouts/vertical-fluid.jpg)
`LAYOUT_WIDTH_TYPES.FLUID`

![image](../assets/images/layouts/vertical-boxed.jpg)
`LAYOUT_WIDTH_TYPES.BOXED`

#### Layout Position

`LAYOUT_POSITION_TYPES.FIXED`

`LAYOUT_POSITION_TYPES.SCROLLABLE`

#### Topbar Colors

![image](../assets/images/layouts/topbar-light.jpg)
`LAYOUT_TOPBAR_COLOR_TYPES.LIGHT`

![image](../assets/images/layouts/topbar-dark.jpg)
`LAYOUT_TOPBAR_COLOR_TYPES.DARK`

#### Sidebar Sizes

![image](../assets/images/layouts/sidebar-lg.jpg)
`SIDEBAR_SIZE.LARGE`

![image](../assets/images/layouts/sidebar-md.jpg)
`SIDEBAR_SIZE.MEDIUM`

![image](../assets/images/layouts/sidebar-sm.jpg)
`SIDEBAR_SIZE.SMALL`

![image](../assets/images/layouts/sidebar-sm-hover.jpg)
`SIDEBAR_SIZE.SMALLHOVER`

#### Sidebar View

![image](../assets/images/layouts/vertical-fluid.jpg)
`SIDEBAR_VIEW.DEFAULT`

![image](../assets/images/layouts/vertical-detached.jpg)
`SIDEBAR_VIEW.DETACHED`

#### Sidebar Colors

![image](../assets/images/layouts/sidebar-light.jpg)
`SIDEBAR_COLOR.LIGHT`

![image](../assets/images/layouts/sidebar-lg.jpg)
`SIDEBAR_COLOR.DARK`

![image](../assets/images/layouts/sidebar-gradient.jpg)
`SIDEBAR_COLOR.GRADIENT`

![image](../assets/images/layouts/sidebar-gradient-2.jpg)
`SIDEBAR_COLOR.GRADIENT2`

![image](../assets/images/layouts/sidebar-gradient-3.jpg)
`SIDEBAR_COLOR.GRADIENT3`

![image](../assets/images/layouts/sidebar-gradient-4.jpg)
`SIDEBAR_COLOR.GRADIENT3`

#### Sidebar Images

![image](../assets/images/layouts/vertical-fluid.jpg)
`SIDEBAR_IMAGE.NONE`

![image](../assets/images/layouts/sidebar-img-1.jpg)
`SIDEBAR_IMAGE.IMAGE1`

![image](../assets/images/layouts/sidebar-img-2.jpg)
`SIDEBAR_IMAGE.IMAGE2`

![image](../assets/images/layouts/sidebar-img-3.jpg)
`SIDEBAR_IMAGE.IMAGE3`

![image](../assets/images/layouts/sidebar-img-4.jpg)
`SIDEBAR_IMAGE.IMAGE4`

#### Preloader Option

`PERLOADER_TYPES.DISABLE`

`PERLOADER_TYPES.ENABLE`
