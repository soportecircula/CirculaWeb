# CKeditor

Fuente: https://themesbrand.com/velzon/docs/angular/ckeditor.html

---

#### CKeditor

1. [Forms](javascript: void(0);)
2. CKeditor

##### Overview[Official Website](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)

Ck Editor is a set of ready-to-use rich text editors created with a powerful framework. Made with real-time collaborative editing in mind.

###### Add Package

```
npm install --save @ckeditor/ckeditor5-build-classic
npm install --save @ckeditor/ckeditor5-angular
```

###### Remove Package

```
npm uninstall @ckeditor/ckeditor5-build-classic, npm uninstall @ckeditor/ckeditor5-angular or you can remove package by removing specific package from package.json
```

##### Examples

| Title | Script |
| --- | --- |
| CK Editor | ``` <ckeditor [editor]="Editor" data=""></ckeditor> ``` | ``` import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'; public Editor = ClassicEditor; ``` |
