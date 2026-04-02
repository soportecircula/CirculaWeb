# Social Setup

Fuente: https://themesbrand.com/velzon/docs/angular/api-integration.html

---

#### API Integration

##### How to Integrate custom API?

Please follow the below steps to make the custom API working.

1. Let's assume that our API's URL is
   "https://jsonplaceholder.typicode.com/posts". First we have to add this URL in
   `/src/app/global-component.ts` file

   ```
   ...
   export const GlobalComponent = {
       // Api Calling
       API_URL : 'http://127.0.0.1:3000/',
       headerToken : {'Authorization': `Bearer ${localStorage.getItem('token')}`},

       // Auth Api
       AUTH_API:"http://127.0.0.1:3000/auth/",

       // Products Api
       product:'apps/product',
       productDelete:'apps/product/',

       // Orders Api
       order:'apps/order',
       orderId:'apps/order/',

       // Customers Api
       customer:'apps/customer',
       
   };
   ```
2. Whatever methods you want to use, import it `import { GlobalComponent } from "../../global-component";`
   and add below function in `src/app/core/services/rest-api.service.ts` file. We have created new function getDemoData and exported it so it can be used in another files.

   ```
   import { GlobalComponent } from "../../global-component";
   import { Injectable } from '@angular/core';
   import { HttpClient, HttpHeaders } from '@angular/common/http';
   import { Observable } from 'rxjs';

   const httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
   };
                 
   export class restApiService {
       ...   
   }
   ```
3. let's setup auth middleware with api.  

   to setup middleware change below code in `src/app/core/service/auth.service.ts.`
   this will check user is authenticated or not.

   ```
   import { Injectable } from '@angular/core';
   import { getFirebaseBackend } from '../../authUtils';
   import { User } from '../models/auth.models';
   import { HttpClient, HttpHeaders } from '@angular/common/http';
   import { BehaviorSubject, Observable } from 'rxjs';
   import { GlobalComponent } from "../../global-component";

   const AUTH_API = GlobalComponent.AUTH_API;

   const httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };
                    
   export class AuthenticationService {
       register(email: string, first_name: string, password: string) {
           return this.http.post(AUTH_API + 'signup', {
               email,
               first_name,
               password,
             }, httpOptions);
       }
   }
   ```
4. Now set post method api for signup with below function

   ```
   import { AuthenticationService } from '../../core/services/auth.service';

   constructor(private authenticationService: AuthenticationService) { }
                        
   onSubmit() {
       this.submitted = true;

       //Register Api
       this.authenticationService.register(this.f['email'].value, this.f['name'].value, this.f['password'].value).pipe(first()).subscribe(
           (data: any) => {
           this.successmsg = true;
           if (this.successmsg) {
           this.router.navigate(['/auth/login']);
           }
       },
       (error: any) => {
           this.error = error ? error : '';
       });
   }
   ```
5. **Database setup for Backend api**

   -***MongoDB Compass(option 1)***

   Make sure to have the  [MongoDB Compass](https://www.mongodb.com/try/download/compass) installed
   & running in your computer. If you already have installed compass on
   your
   computer, you can skip this step.

   STEP-1: open compass and connect with localhost

   ![](../assets/images/mongodb-setup/compass.png)

   ---

   -***MongoDB Atlas(option 2)***

   Make sure to have Account in [MongoDB
   Atlas.](https://www.mongodb.com/try)
   If you don't have account then create Atlas account and follow below
   steps
   to connect with MongoDb Atlas.

   STEP-1: Create account

   ![](../assets/images/mongodb-setup/Atlasacc.png)  
     

   STEP-2: After verifying email click on build Database

   ![](../assets/images/mongodb-setup/mongo_db_1.png)  
     

   STEP-3: Choose shared database for free...

   ![](../assets/images/mongodb-setup/mongo_db_2.png)  
     

   STEP-4: Click on `create cluster`

   ![](../assets/images/mongodb-setup/mongo_db_3.png)  
     

   STEP-5: Wait until the process is completed and then click on
   `connect`

   ![](../assets/images/mongodb-setup/mongo_db_4.png)  
     

   STEP-6: Select your current ip address and then create your username and
   password then click on create database.

   ![](../assets/images/mongodb-setup/mongo_db_5.png)  
     

   STEP-7: After that, click on second option `"connect your
   application"` (*if you
   don't see any model then click on connect*)

   ![](../assets/images/mongodb-setup/mongo_db_6.png)  
     

   STEP-8: Now copy the given link and close the model

   ![](../assets/images/mongodb-setup/mongo_db_7.png)  
     

   STEP-9: Now Open **'config.env' In Node API** and then paste the link in
   `DATABASE=" "` And then add your password in
   `DATABASE_PASSWORD=" "`.

   STEP-10: Now click on `Collections` and then click `Add
   My Own Data`

   ![](../assets/images/mongodb-setup/mongo_db_8.png)  
     

   STEP-11: Then Enter your database name and collection(table) name

   ![](../assets/images/mongodb-setup/mongo_db_9.png)
