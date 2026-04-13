# Folder Structure

Fuente: https://themesbrand.com/velzon/docs/angular/folder-structure.html

---

#### Folder Structure

1. [Docs](javascript: void(0);)
2. Folder Structure

Use below velzon structure for modify and better understand the **Velzon**.

###### 1. Velzon Angular Folders

| Folder | Path | Uses |
| --- | --- | --- |
| Account | `app/account/` | All auth pages here. |
| core | `app/core/` | All services manage from here. |
| extrapages | `app/extrapages/` | All Extrapages here. |
| landing | `app/landing/` | All landing related pages. |
| layout | `app/layout/` | All layout related Files |
| pages | `app/pages/` | All pages related this project. |
| shared | `app/shared/` | refer to a module commonly used component like (breadcrumb) |

###### 2. Velzon Angular Layout Files

| File | Path | Uses |
| --- | --- | --- |
| rightsidebar.component.ts | `app/layouts/rightsidebar/` | customizer related code. |
| footer.component.ts | `app/layouts/footer/` | footer related code. you can modify as per your requirements. |
| horizontal.component.ts | `app/layouts/horizontal/` | horizontal layout master. |
| two-column.component.ts | `app/layouts/two-column/` | two column layout master. |
| vertical.componnet.ts | `app/layouts/vertical/` | vertical hovered layout master. |
| layout.component.ts | `app/layouts/` | default layout master file, you can set html attributes, and change common layouts changing this file. |
| sidebar.component.ts | `app/layouts/sidebar/` | sidebar menus related code, you can add new menu here. |
| topbar.component.ts | `app/layouts/topbar/` | topbar related code here, you can easily customize topbar from here. |
| horizontal-topbar.component.ts | `app/layouts/horizontal-topbar/` | horizontal-topbar related code here, you can easily customize horizontal-topbar from here. |
| two-column-sidebar.component.ts | `app/layouts/two-column-sidebar/` | two-column-sidebar related code here, you can easily customize two-column-sidebar from here. |

###### 3. Velzon Angular Component Files

| File | Path | Uses |
| --- | --- | --- |
| breadcrumb.component.ts | `app/shared/breadcrumbs/` | page title component, you can easily customize it. |

###### 4. Velzon Angular Auth Files

| File | Path | Uses |
| --- | --- | --- |
| login.component.html | `app/account/login` | login view page code, if you need to customize login you can do from this. |
| register.component.html | `app/account/register` | registration page view code. |
| authUtils.ts | `app/authUtils.ts` | handling Firebase authentication and user management. |
| global.component.ts | `app/global.component.ts` | ALl API URL from here. |
| auth.service.ts | `app/core/services/auth.service.ts` | Angular service for handling user authentication and registration, with options for using Firebase or custom API endpoints. |
| authfake.service.ts | `app/core/guards/authfake.service.ts` | Angular service for user authentication using a fake backend, including login and logout functionality with token-based storage. |
| auth-guard.ts | `app/core/guards/auth-guard.ts` | Angular route guard that checks for user authentication based on the chosen authentication method (Firebase or API), |

* [<= v3.\*](#v351)
* [>= v4.0.0](#v400)

* [Admin](javascript: void(0);)
* [![](../assets/images/extra/folder.png) corporate](javascript: void(0);)

  [![](../assets/images/extra/folder.png)creative](javascript: void(0);)

  [![](../assets/images/extra/folder.png)default](javascript: void(0);)

  + [![](../assets/images/extra/folder.png)src](javascript: void(0);)

    - [![](../assets/images/extra/folder.png)app](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)account](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)core](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)extraspages](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)layouts](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)pages](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)shared](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app-routing.module.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.html](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.scss](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.spec.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.module.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)authUtils.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)global.component.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)typings.d.ts](javascript: void(0);)
    - [assets](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)fonts](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)i18n](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)images](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)json](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)lang](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)scss](javascript: void(0);)
    - [![](../assets/images/extra/file.png)environments](javascript: void(0);)
    - [![](../assets/images/extra/file.png)favicon.ico](javascript: void(0);)
    - [![](../assets/images/extra/file.png)index.html](javascript: void(0);)
    - [![](../assets/images/extra/file.png)main.ts](javascript: void(0);)
    - [![](../assets/images/extra/file.png)polyfills.ts](javascript: void(0);)
    - [![](../assets/images/extra/file.png)styles.scss](javascript: void(0);)
    - [![](../assets/images/extra/file.png)test.ts](javascript: void(0);)
    - [![](../assets/images/extra/file.png)typings.d.ts](javascript: void(0);)

    [![](../assets/images/extra/file.png)angular.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)karma.conf.js](javascript: void(0);)

    [![](../assets/images/extra/file.png)package-lock.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)package.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)README.md](javascript: void(0);)

    [![](../assets/images/extra/file.png)tsconfig.app.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)tsconfig.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)tsconfig.spec.json](javascript: void(0);)

  [![](../assets/images/extra/folder.png)galaxy](javascript: void(0);)

  [![](../assets/images/extra/folder.png)interactive](javascript: void(0);)

  [![](../assets/images/extra/folder.png)material](javascript: void(0);)

  [![](../assets/images/extra/folder.png)minimal](javascript: void(0);)

  [![](../assets/images/extra/folder.png)modern](javascript: void(0);)

  [![](../assets/images/extra/folder.png)sass](javascript: void(0);)

* [Master](javascript: void(0);)
* + [![](../assets/images/extra/folder.png)src](javascript: void(0);)

    - [![](../assets/images/extra/folder.png)app](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)account](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)core](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)extraspages](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)layouts](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)pages](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)shared](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app-routing.module.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.html](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.scss](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.spec.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.component.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)app.module.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)authUtils.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)global.component.ts](javascript: void(0);)
      * [![](../assets/images/extra/file.png)typings.d.ts](javascript: void(0);)
    - [assets](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)fonts](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)i18n](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)images](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)json](javascript: void(0);)
      * [![](../assets/images/extra/folder.png)lang](javascript: void(0);)
      * [scss](javascript: void(0);)
        + [components
           // all
          components scss files will be in
          this folder.](javascript: void(0);)
        + [fonts](javascript: void(0);)
        + [pages](javascript: void(0);)
        + [plugins](javascript: void(0);)
        + [rtl](javascript: void(0);)
        + [structure](javascript: void(0);)
        + [theme
           // all
          scss files related to theme are
          in specific filder](javascript: void(0);)
          - [\_default.scss](javascript: void(0);)
          - [\_creative.scss](javascript: void(0);)
          - [\_interactive.scss](javascript: void(0);)
          - [\_material.scss](javascript: void(0);)
          - [\_minimal.scss](javascript: void(0);)
          - [\_modern.scss](javascript: void(0);)
          - [\_saas.scss](javascript: void(0);)
          - [\_galaxy.scss](javascript: void(0);)
          - [\_corporate.scss](javascript: void(0);)
          - [\_classic.scss](javascript: void(0);)
          - [\_vintage.scss](javascript: void(0);)
        + [\_variables-custom.scss](javascript: void(0);)
        + [\_variables-dark.scss](javascript: void(0);)
        + [\_variables-galaxy-dark.scss](javascript: void(0);)
        + [\_variables.scss](javascript: void(0);)
        + [app.scss](javascript: void(0);)
        + [bootstrap.scss](javascript: void(0);)
        + [custom.scss](javascript: void(0);)
        + [icons.scss](javascript: void(0);)
    - [![](../assets/images/extra/file.png)environments](javascript: void(0);)
    - [![](../assets/images/extra/file.png)favicon.ico](javascript: void(0);)
    - [![](../assets/images/extra/file.png)index.html](javascript: void(0);)
    - [![](../assets/images/extra/file.png)main.ts](javascript: void(0);)
    - [![](../assets/images/extra/file.png)polyfills.ts](javascript: void(0);)
    - [![](../assets/images/extra/file.png)styles.scss](javascript: void(0);)
    - [![](../assets/images/extra/file.png)test.ts](javascript: void(0);)
    - [![](../assets/images/extra/file.png)typings.d.ts](javascript: void(0);)

    [![](../assets/images/extra/file.png)angular.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)karma.conf.js](javascript: void(0);)

    [![](../assets/images/extra/file.png)package-lock.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)package.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)README.md](javascript: void(0);)

    [![](../assets/images/extra/file.png)tsconfig.app.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)tsconfig.json](javascript: void(0);)

    [![](../assets/images/extra/file.png)tsconfig.spec.json](javascript: void(0);)
