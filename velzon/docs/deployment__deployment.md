# Deployment

Fuente: https://themesbrand.com/velzon/docs/angular/deployment.html

---

#### Deployment

1. [Docs](javascript: void(0);)
2. Deployment

#### Angular for production

Generates a /dist directory with all the production files.

```
Copy ng build --prod
```

To create build as per your sub directory or sub folder requirement.

set path in index.html file

```
Copy <base href='/my/app/'>
```

You also can set the base href right in the ng build command

```
Copy  ng build --prod --base-href='/my/app/'
```

**You may face following issue while generating build**

JavaScript heap out of memory

For Windows users:

```
Copy  node --max_old_space_size=8192 'node_modules\@angular\cli\bin\ng' build --prod
```

For Linux and Mac users:

```
Copy  node --max_old_space_size=8192 ./node_modules/.bin/ng build --prod
```
