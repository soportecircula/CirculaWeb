# Two Column

Fuente: https://themesbrand.com/velzon/docs/angular/two-column.html

---

#### Two Column

1. [Docs](javascript: void(0);)
2. Two Column

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

#### Topbar Colors

![image](../assets/images/layouts/twocolumn-sidebar-light.jpg)
`LAYOUT_TOPBAR_COLOR_TYPES.LIGHT`

![image](../assets/images/layouts/twocolumn-topbar-dark.jpg)
`LAYOUT_TOPBAR_COLOR_TYPES.DARK`

#### Sidebar Colors

![image](../assets/images/layouts/twocolumn-sidebar-light.jpg)
`SIDEBAR_COLOR.LIGHT`

![image](../assets/images/layouts/twocolumn-sidebar-dark.jpg)
`SIDEBAR_COLOR.DARK`

![image](../assets/images/layouts/twocolumn-sidebar-gradient.jpg)
`SIDEBAR_COLOR.GRADIANT`

![image](../assets/images/layouts/twocolumn-sidebar-gradient-2.jpg)
`SIDEBAR_COLOR.GRADIENT2`

![image](../assets/images/layouts/twocolumn-sidebar-gradient-3.jpg)
`SIDEBAR_COLOR.GRADIENT3`

![image](../assets/images/layouts/twocolumn-sidebar-gradient-4.jpg)
`SIDEBAR_COLOR.GRADIENT4`

#### Sidebar Images

![image](../assets/images/layouts/twocolumn-sidebar-dark.jpg)
`SIDEBAR_IMAGE.NONE`

![image](../assets/images/layouts/twocolumn-sidebar-img-1.jpg)
`SIDEBAR_IMAGE.IMAGE1`

![image](../assets/images/layouts/twocolumn-sidebar-img-2.jpg)
`SIDEBAR_IMAGE.IMAGE2`

![image](../assets/images/layouts/twocolumn-sidebar-img-3.jpg)
`SIDEBAR_IMAGE.IMAGE3`

![image](../assets/images/layouts/twocolumn-sidebar-img-4.jpg)
`SIDEBAR_IMAGE.IMAGE4`

#### Preloader Option

`PERLOADER_TYPES.DISABLE`

`PERLOADER_TYPES.ENABLE`
