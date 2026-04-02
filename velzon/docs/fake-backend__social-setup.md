# Social Setup

Fuente: https://themesbrand.com/velzon/docs/angular/fake-backend.html

---

##### Fake-Backend

Set `defaultauth=fackbackend` in the
`environment.ts` file.   
 Also fill all the firebase credentials in the `environment.ts`
file.   
Now just uncomment the below fack-backend setup code in the `app.module.ts` file.

```
import { FakeBackendInterceptor } from './core/helpers/fake-backend';

if (environment.defaultauth === 'firebase') {
    initFirebaseBackend(environment.firebaseConfig);
} else {
    FakeBackendInterceptor;
}
```
