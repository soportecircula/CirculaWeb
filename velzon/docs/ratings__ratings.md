# Ratings

Fuente: https://themesbrand.com/velzon/docs/angular/ratings.html

---

#### Rating

1. [Advance UI](javascript: void(0);)
2. Rating

##### Overview [Official Website](https://www.npmjs.com/package/react-rating)

Angular Bootstrap Rating is the best star rater for the browser. No dependencies. Unlimited number of stars.

###### Add Package

```
npm install @ng-bootstrap/ng-bootstrap --save
```

###### Remove Package

```
npm uninstall @ng-bootstrap/ng-bootstrap or you can remove package by removing specific package from package.json
```

##### Examples

| Title | Script |
| --- | --- |
| Basic Rater | ``` <ngb-rating [(rate)]="defaultSelect" [readonly]="readonly" class="stars" [max]=5></ngb-rating > ``` | ``` defaultSelect = 2; readonly = false; ``` |
| Rater with Step | ``` <ng-template #t let-fill="fill"> <span class="star" [class.full]="fill === 100"> <span class="half" [style.width.%]="fill">â</span >â</span> </ng-template> <ngb-rating class="d-inline-flex stars align-middle star-rating" [(rate)]="currentRate" [starTemplate]="t" [readonly]="true" [max]="5"> </ngb-rating> <button class="btn btn-outline-light btn-sm ms-2" (click)="currentRate = 1.5">1.5</button> <button class="btn btn-outline-light btn-sm ms-2" (click)="currentRate = 4.5">4.5</button> ``` currentRate = 2; ``` | ``` |
| Custom Messages | ``` <ngb-rating [(rate)]="customColor"> <ng-template let-fill="fill" let-index="index"> <span class="stars star_fill" [class.filled]="fill === 100" [class.bad]="index < 3">★</span> </ng-template> </ngb-rating> ``` | ``` customColor = 4; ``` |
| Example with unlimited number of stars. readOnly option is set to true | ``` <ngb-rating [rate]="3" [readonly]="true" [max]="16" class="stars"></ngb-rating> ``` |  |
| On Hover Event | ``` <ngb-rating [(rate)]="hoverSelect" (hover)="hovered=$event" (leave)="hovered=0" [readonly]="readonly" class="stars" [max]=5></ngb-rating> <span class="ratingnum badge bg-info align-middle ms-2">{{hovered}}</span> ``` | ``` hoverSelect = 2, hovered = 0; ``` |
| Clear/Reset Rater | ``` <ngb-rating [(rate)]="clearRate" [readonly]="readonly" class="stars align-middle star-rating" [max]=5></ngb-rating> <button id="raterreset-button" class="btn btn-outline-primary btn-sm ms-2" (click)="clearRate = 0">Reset</button> ``` | ``` clearRate = 2; ``` |
