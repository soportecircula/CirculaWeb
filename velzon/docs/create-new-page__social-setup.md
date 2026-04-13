# Social Setup

Fuente: https://themesbrand.com/velzon/docs/angular/create-new-page.html

---

###### 1. Add your new page's route in `/src/app/pages` folders.

* run `ng g c newpage`
* Example :-

  ```
  import {newPagecomponent} from "../pages/newPage/newPage.component"

  const routes: Routes = [
      {
          path: "newPage",
          component: newPagecomponent
      },                                        
  ]
  ```
