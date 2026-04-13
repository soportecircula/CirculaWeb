# Routing

Fuente: https://themesbrand.com/velzon/docs/angular/routing.html

---

#### Routing

1. [Docs](javascript: void(0);)
2. Routing

#### Routing

Velzon Angular is having routing setup based on
app-routing.

You can find our template's router configuration in
`src/app` folder. the
`src/app/app-routing.module.ts` file is containing
all routes of our template.

#### How to add new route ?

You can easily add, change or remove any route by
simply making changes described below:

1. Open `src/app/pages/pages-routing.module.ts` file,
declare your component. E.g.

```
import {newPage} from "../pages/newPage"
```

2. And make sure to add the entry for same with path
and other properties like path and component same as
other routes declared there. if your page is a
public page (with blank layout), then add the route
in
`publicRoutes`, and if your page is a
private page (with full layout) then add route in
`authProtectedRoutes`. E.g.

```
{ path: "/new-page", component: newPage }
```

Each of these properties are explained below:

* **path** : Url relative path
* **component** : Actual component
  name which would get rendered when user visits
  the path

Note : you don't need to restart the development
server in order to see the menu changes getting in
effect
