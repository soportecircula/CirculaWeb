# Multi Language

Fuente: https://themesbrand.com/velzon/docs/angular/multi-language.html

---

#### Multi Language

1. [Docs](javascript: void(0);)
2. Multi Language

#### Multi Language Settings

##### i18n Language translation settings

###### How to add new language?

Let's add German language in the existing language.

1. Create a new file
   `src/assets/i18n/de.json`
2. update the below code in the
   `src/assets/i18n.js` file   
     

   ```
   { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
   ```

   The translationGr JSON file,

   ```
   {
       "Mega Menu": "Mega-Menu",
   }
   ```
3. Now add the new option of German language in the
   topbar language dropdown menu
   `src/app/layouts/topbar/topbar.component.ts`
4. install `ngx-translate` and `ngx-cookie-service` packages
5. `ngx-translate` import in **app.module.ts** file

   ```
   import { TranslateHttpLoader } from '@ngx-translate/http-loader';
   import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

   export function createTranslateLoader(http: HttpClient): any {
     return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
   }

   @NgModule({
     imports: [
       TranslateModule.forRoot({
         defaultLanguage: 'en',
         loader: {
           provide: TranslateLoader,
           useFactory: (createTranslateLoader),
           deps: [HttpClient]
         }
       }),
     ]
   });
   ```
