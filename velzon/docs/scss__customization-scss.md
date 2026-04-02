# Customization SCSS

Fuente: https://themesbrand.com/velzon/docs/angular/scss.html

---

#### SCSS

1. [Customization](javascript: void(0);)
2. SCSS

##### Structure

Velzon has managed the scss file in the
`src/assets/scss` folder.
You can add your custom scss in the
`custom.scss` file instead of doing changes in the app.scss or
other scss
files as it will create conflicts in future updates.

* [sass](javascript: void(0);)
* [components](javascript: void(0);)

  + [All
    the components scss files are here.](javascript: void(0);)

  [config](javascript: void(0);)
  + [default](javascript: void(0);)
    - [\_variables-custom.scss](javascript: void(0);)
    - [\_variables-dark.scss](javascript: void(0);)
    - [\_variables.scss](javascript: void(0);)
    - [angular-custom.scss](javascript: void(0);)
    - [app.scss](javascript: void(0);)
    - [bootstrap.scss](javascript: void(0);)
    - [custom.scss](javascript: void(0);)

  [fonts](javascript: void(0);)
  + [\_fonts.scss](javascript: void(0);)

  [pages](javascript: void(0);)
  + [All
    the pages scss files are here.](javascript: void(0);)

  [plugins](javascript: void(0);)
  + [icons](javascript: void(0);)
    - [All
      the icons scss files are here](javascript: void(0);)
  + [All
    the plugins scss files are here.](javascript: void(0);)

  [rtl](javascript: void(0);)
  + [All
    the RTL scss files are here.](javascript: void(0);)

  [structure](javascript: void(0);)
  + [\_footer.scss](javascript: void(0);)
  + [\_horizontal.scss](javascript: void(0);)
  + [\_layouts.scss](javascript: void(0);)
  + [\_page-head.scss](javascript: void(0);)
  + [\_topbar.scss](javascript: void(0);)
  + [\_two-column.scss](javascript: void(0);)
  + [\_vertical.scss](javascript: void(0);)

  [icons.scss](javascript: void(0);)

#### Layout Structure

We have added all layouts files in the `src/assets/scss/structure`
folder.

`_footer.scss:`
:   Footer-related scss define in this file.

`_horizontal.scss:`
:   Horizontal layout scss managed in this
    file.

`_layouts.scss:`
:   Manage Boxed layout scss in this file.

`_page-head.scss:`
:   Manage page heading scss in this file.

`_topbar.scss:`
:   Topbar scss in this file.

`_two-column.scss:`
:   Two Column scss in this file.

`_vertical.scss:`
:   Vertical layout scss in this file.

#### Variables Structure

We have define all the variables in the
`src/assets/scss/config/default` folder.

`_variables.scss:`
:   All bootstrap variables are defined in
    this file.

#### Other scss file Structure

We have created all the scss files in the `src/assets/scss` folder.

components:
:   All components related scss files are
    created in this folder.

fonts:
:   All fonts are imported in this scss file.

pages:
:   All the pages related scss are written in
    this folder and page wise scss
    are created i.e. \_authentication.scss, \_chat.scss, \_dashboard.scss etc

plugins:
:   All the plugins ( Apex chart, ckeditor,
    full calendar etc ) are created
    in plugins folder.

rtl:
:   All rtl files are imported in this scss file.

icons.scss:
:   All icons scss are imported in this file.

#### Quick customization of layout using scss.

You can make changes in the
`src/assets/scss/config/default/_variables.scss` file.

| Variables | Description |
| --- | --- |
| ``` $primary:       $indigo; $secondary:     $blue; $success:       $green; $info:          $cyan; $warning:       $yellow; $danger:        $red; $light:         $gray-100; $dark:          $gray-900; ``` | You can manage those colors to update color theme. |
| ``` $font-family-primary:                             'Poppins', sans-serif; $font-family-secondary:                           'hkgrotesk', sans-serif; ``` | You can set the default font in these variables. |
| ``` $vertical-menu-width:                             250px; $vertical-menu-width-md:                          180px; $vertical-menu-width-sm:                          70px; ``` | Set the sidebar menu with in these variables. |
