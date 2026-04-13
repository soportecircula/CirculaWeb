# Flatpickr

Fuente: https://themesbrand.com/velzon/docs/angular/flatpickr.html

---

#### Flatpickr

1. [Forms](javascript: void(0);)
2. Flatpickr

##### Overview[Official Website](https://www.npmjs.com/package/angularx-flatpickr)

flatpickr is a lightweight and powerful datetime picker.

###### Add Package

```
npm install flatpickr angularx-flatpickr --save
```

###### Remove Package

```
npm uninstall flatpickr angularx-flatpickr or you can remove package by removing specific package from package.json
```

##### Flatpickr Examples

| Title | HTML |
| --- | --- |
| Basic | ``` <input class="form-control flatpickr-input" type="text" mwlFlatpickr [altInput]="true" [convertModelValue]="true"> ``` |
| DateTime | ``` <input class="form-control flatpickr-input" type="text" mwlFlatpickr [altInput]="true" [enableTime]="true" [convertModelValue]="true" [dateFormat]="'Y-m-d H:i'" > ``` |
| Human-Friendly Dates | ``` <input class="form-control flatpickr-input" type="text" mwlFlatpickr [altInput]="true" [convertModelValue]="true" altFormat="F j, Y" dateFormat="Y-m-d"> ``` |
| Selecting multiple dates | ``` <input class="form-control flatpickr-input" type="text" id="example-week-input" mwlFlatpickr [altInput]="true" [convertModelValue]="true" mode="multiple"> ``` |
| Range | ``` <input class="form-control flatpickr-input" type="text" mwlFlatpickr [altInput]="true" [convertModelValue]="true" mode="range"> ``` |
| Timepicker | ``` <input class="form-control flatpickr-input" type="text" mwlFlatpickr [noCalendar]="true" [enableTime]="true" [dateFormat]="'H:i'"> ``` |
| Inline Date Picker Demo | ``` <input class="form-control flatpickr-input" type="text" mwlFlatpickr [(ngModel)]="inlineDatePicker" [altInput]="true" [convertModelValue]="true" [inline]="true" > ``` |
