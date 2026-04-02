# Choices

Fuente: https://themesbrand.com/velzon/docs/angular/choices.html

---

#### Choices

1. [Forms](javascript: void(0);)
2. Choices

##### Overview[Official Website](https://www.npmjs.com/package/@ng-select/ng-select)

ng-select is a TypeScript Package that converts the normal select or input into customizable select inputs with multi-select and autocomplete support.

###### Add Package

```
npm install @ng-select/ng-select --save
```

###### Remove Package

```
npm uninstall @ng-select/ng-select or you can remove package by removing specific package from package.json
```

##### Examples:

| Title | Template |
| --- | --- |
| Default Choice | ``` <ng-select [(ngModel)]="selectedCar">     <ng-option *ngFor="let car of cars" [value]="car.id">{{car.name}}</ng-option> </ng-select> ``` |
| Option Groups | ``` <ng-select [items]="groups" bindLabel="name" groupBy="country" placeholder="Select an item">     <ng-template ng-label-tmp let-item="item">         <div class="group-label">{{ item.label }}</div>     </ng-template> </ng-select> ``` |
| Options added with no search | ``` <ng-select [(ngModel)]="selectedCar" [searchable]="true">     <ng-option *ngFor="let car of cars" [value]="car.id">{{car.name}}</ng-option> </ng-select> ``` |
| Default Multiple Select | ``` <ng-select [items]="colors" bindLabel="name" [multiple]="true" placeholder="Select colors"></ng-select>/code> ``` |
| Multiple Select with remove button | ```  <ng-select [items]="selectValue" [multiple]="true"></ng-select> ``` |
| Multiple Select with options group. | ```  <ng-select [items]="Groups" [multiple]="true" bindLabel="name" bindValue="name" groupBy="country">     <ng-template ng-optgroup-tmp let-item="item">         {{item.country || 'Unnamed group'}}     </ng-template> </ng-select> ``` |
| Choices select limit with text input & removebutton | ``` <ng-select bindLabel="name" [addTag]="true" [multiple]="true" [hideSelected]="true" [minTermLength]="2" typeToSearchText="Please enter 2 or more characters"></ng-select> ``` |
| Choices with disable option | ``` <ng-select [items]="Default" bindLabel="name" [multiple]="true" [disabled]="disable" [(ngModel)]="selectedPeople"></ng-select> ``` |
