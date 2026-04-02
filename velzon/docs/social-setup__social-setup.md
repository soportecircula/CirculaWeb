# Social Setup

Fuente: https://themesbrand.com/velzon/docs/angular/social-setup.html

---

#### Firebase

install `npm i firebase` package.  
Set `defaultauth=firebase` in the
`environment.ts` file.   
 Also fill all the firebase credentials in the `environment.ts`
file.   
Now just uncomment the below firebase setup code in the `environment.ts` file.

```
                                          		  
// Import Firebase Configuration file

firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
```

#### Follow the below step to setup your Firebase application :-

Do your Firebase project setup in
<https://console.firebase.google.com/>

##### Step 1 :- Click on the **GET STARTED** Button.

![image](../assets/images/firebase-setup/Firebase1.png)

##### Step 2 :- You will find the tab of Create a Project, click on this.

![image](../assets/images/firebase-setup/Firebase-console.png)

###### I :- Enter your project name, accept the Firebase terms and then press continue.

![image](../assets/images/firebase-setup/create-project-1.png)

###### II :- Read the instrustions and continue.

![image](../assets/images/firebase-setup/create-project-2.png)

###### III :- First select the location and accept the Google Analytics terms then click on the CREATE PROJECTS.

![image](../assets/images/firebase-setup/create-project-3.png)

###### IV :- Now your project is created! Let's do some projects setup.

![image](../assets/images/firebase-setup/create-project-4.png)

###### Step 3 :- Go to the Project Settings Page.

![image](../assets/images/firebase-setup/project-settings.png)

##### Step 4 :- Go to the Web app.

![image](../assets/images/firebase-setup/web-app.png)

##### Step 5 :- Project settings > Enter your app nickname then click on the tab of REGISTER APP after that Read all details of Add Firebase SDK, Install Firebase CLI, and Deploy to Firebase Hosting and click on the CONTINUE TO THE CONSOLE

![image](../assets/images/firebase-setup/demoâproject.png)

##### Step 6 :- Now you will find the options Config, click on that and you will see Firebase config details, do copy it and paste it in your project.

![image](../assets/images/firebase-setup/firebaseConfig.png)
