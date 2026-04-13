# Icons

Fuente: https://themesbrand.com/velzon/docs/angular/icons.html

---

#### Icons

1. [Docs](javascript: void(0);)
2. Icons

###### Icon Scss

**icon.scss** is source file for the all custom icon
plugins.

```
<!-- icon scss -->
<link rel="stylesheet" href="{{ URL::asset('assets/scss/icon.scss') }}">
```

##### Remix icons[Official Website](https://remixicon.com/)

Remix Icon is a set of open-source neutral-style system
symbols elaborately crafted for designers and developers.
of the icons are free for both personal and commercial use.

###### Scss File

Remix icons are scss based here.where remix icon code is
written in **\_remixicon.scss**

```
<!-- remix icon scss -->
@import "custom/plugins/icons/remixicon";
```

###### Example

```
<i class="ri-home-line"></i> or <i class="ri-home-fill"></i>
```

##### Box icons[Official Website](https://boxicons.com/)

Boxicons is a free collection of carefully crafted open
source icons.Each icon is designed on a 24px grid with the material guidelines.

###### Scss File

Remix icons are scss based here.where remix icon code is
written in **\_boxicon.scss**

```
<!-- box icon scss -->
@import "custom/plugins/icons/boxicons";
```

###### Example

```
<i class="bx bx-**"></i>
```

##### Material Design Icons[Official Website](https://materialdesignicons.com/)

Material Design Icon is growing icon collection allows
designers and developers targeting various platforms to download icons in the
format,
color and size they need for any project.

###### Scss File

Material Design Icons are scss based here.where remix icon
code is written in **\_materialdesignicons.scss**

```
<!-- material design icons scss -->
@import "custom/plugins/icons/materialdesignicons";
```

###### Example

```
<i class="mdi mdi-*-*"></i>
```

##### Line Awesome[Official Website](https://icons8.com/line-awesome)

Line Awesome consists line icons with a single line of code.

###### Scss File

Line Awesome Icons are scss based here.where remix icon code
is written in **\_line-awesome.scss**

```
<!-- line awesome icons scss -->
@import "custom/plugins/icons/line-awesome";
```

###### Example

```
<i class="lab la-*-*"></i>
```

##### Feather Icons[Official Website](https://www.npmjs.com/package/react-feather)

Feather is a collection of simply beautiful open source
icons. Each icon is designed on a 24x24 grid
with an emphasis on simplicity, consistency, and flexibility.

###### Javascript

```
<script src="{{ URL::asset('assets/libs/feather-icons/feather.min.js') }}"></script>
```

###### Example

```
<FeatherIcon icon="**"/>
```
