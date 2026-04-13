# Color pickr

Fuente: https://themesbrand.com/velzon/docs/angular/colorpicker.html

---

#### Color pickr

1. [Forms](javascript: void(0);)
2. Color pickr

##### Overview[Official Website](https://www.npmjs.com/package/ngx-color-picker)

Colorpickr: Flat, simple, multi-themed, responsive and hackable Color-Picker library.

###### Add Package

```
npm install ngx-color-picker --save
```

###### Remove Package

```
npm uninstall ngx-color-picker or you can remove package by removing specific package from package.json
```

##### Colorpickr Examples:

| Title | Template |
| --- | --- |
| Classic Demo | ``` <input [(colorPicker)]="componentcolor" [style.background]="componentcolor" /> componentcolor: any = '#405189'; ``` |
| Monolith Demo | ```  <input [(colorPicker)]="monolith" [style.background]="monolith" [cpPresetColors]="['#fff','#000','#2889e9','#e920e9','#fff500','rgb(236,64,64)']" /> monolith: any = '#0AB39C'; ``` |
| Nano Demo | ``` <input [(colorPicker)]="nano" [style.background]="nano" [cpDisableInput]="true" /> nano: any = '#3577F1'; ``` |
