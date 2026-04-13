# Horizontal

Fuente: https://themesbrand.com/velzon/docs/angular/horizontal.html

---

#### Horizontal

1. [Docs](javascript: void(0);)
2. Horizontal

#### How to use pre-built layouts?

Each of the layout options is provided below with steps you
would need to perform in `src/app/store/layouts/layout-reducers.ts`
folder.

#### Theme Options

**Note :** if you are going to update any object property of initialState,
make sure you use option's corresponding constant
given in `src/app/store/layouts/layout-reducers.ts` file.

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

#### Layout Width

![image](../assets/images/layouts/hori-fluid.jpg)
`LAYOUT_WIDTH_TYPES.FLUID`

![image](../assets/images/layouts/hori-boxed.jpg)
`LAYOUT_WIDTH_TYPES.BOXED`

#### Layout Position

`LAYOUT_POSITION_TYPES.FIXED`

`LAYOUT_POSITION_TYPES.SCROLLABLE`

#### Topbar Colors

![image](../assets/images/layouts/hori-fluid.jpg)
`LAYOUT_TOPBAR_COLOR_TYPES.LIGHT`

![image](../assets/images/layouts/hori-topbar-dark.jpg)
`LAYOUT_TOPBAR_COLOR_TYPES.DARK`

#### Preloader Option

`DATA_PRELOADER.DISABLE`

`DATA_PRELOADER.ENABLE`
