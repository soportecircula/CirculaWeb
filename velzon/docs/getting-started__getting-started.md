# Getting Started

Fuente: https://themesbrand.com/velzon/docs/angular/getting-started.html

---

#### Getting Started

1. [Docs](javascript: void(0);)
2. Getting Started

#### Getting Started

We are using [Angular CLI](https://angular.io/cli) is a command-line interface tool that you use to initialize, develop, scaffold, and maintain Angular applications directly from a command shell.

##### Prerequisites:

Please follow the below steps to install and setup all
prerequisites:

* **Nodejs**

  Make sure to have [Node.js](https://nodejs.org/) installed & running on your computer. If you already have installed Node on your computer, you can skip this step if your existing node version is greater than 22. We suggest you to use LTS version of Node.js.
* **NPM**

  Make sure to have the [NPM](https://docs.npmjs.com/cli/v8/commands/npm-install) installed & running on your computer. If you already have installed NPM on your computer, you can skip this step.

  ```
  Copy npm install -g npm
  ```
* **Angular CLI**

  Make sure to have the [Angular cli](https://gulpjs.com/) installed & running on your computer. Install it before start with the Angular app

  ```
  Copy npm install --global @angular/cli@latest
  ```

  Warning: If you have Angular CLI installed previously, update it to the latest Angular CLI. Remove the older version and re-install it.

  ```
  Copy npm uninstall --global @angular/cli
  ```

  ```
  Copy npm install --global @angular/cli@latest
  ```
* **Git**

  Make sure to have [Git](https://git-scm.com/) installed globally & running on your computer. If you already have installed git on your computer, you can skip this step.   
   To install in Linux OS please run the below commands.

  ```
  Copysudo apt-get update
  sudo apt-get install git
  ```

After you finished with the above steps, you can run the following commands into the terminal/command prompt from the root directory (Judia\_\*/HTML/ ) of the project to run the project locally or build for production use:

**Install the Angular local project dependencies by executing following commands:**

This command will clear your old cached node\_modules.

```
Copynpm clear cache --force
```

This command will install the dependencies in the local node\_modules folder. By default, [npm install --legacy-peer-deps](#) will install all modules listed as dependencies in [package.json](#).

```
Copynpm install --legacy-peer-deps
```

This command launches the server, watches your files, and rebuilds the app as you make changes to those files. Using the [--open (or use -o)](#) option will automatically open your browser on [http://localhost:4200/.](http://localhost:4200) This command will take some time to finsh. Please wait for it to complete.

```
Copyng serve
```

For more detailed information to install the Angular application, visit this official Angular documentation website.

SCSS: We suggest you to do not change any scss files from the src/assets/scss/custom.scss folders because to get new updates will might
be break your SCSS changes if any you have made. We strongly suggest you to use custom.scss file and
use that instead of overwrite any theme's scss files.
