# Google Maps

Fuente: https://themesbrand.com/velzon/docs/angular/google-maps.html

---

#### Google Maps

1. [Maps](javascript: void(0);)
2. Google Maps

##### Overview[Official Website](https://www.npmjs.com/package/@angular/google-maps)

@angular/google-maps contains solutions for the Google Maps JavaScript Core API.

###### Add Package

```
npm install @angular/google-maps --save
```

###### Remove Package

```
npm uninstall @angular/google-maps Or you can remove package by removing specific package from package.json
```

Or you can remove package by removing specific package from package.json

##### Examples

| Title | Javascript |
| --- | --- |
| Basic | Javascript  ``` longitude = 20.728218; latitude = 52.128973; ```  Html  ``` <google-map [latitude]="latitude" [longitude]="longitude" [zoom]="15" width="100%" height="300px"></google-map> ``` |
| Markers | Javascript  ``` longitude = 20.728218; longitude = -77.028333;  zoom: number = 9;  mapOptions: google.maps.MapOptions = { center: { lat: 48.8588548, lng: 2.347035 }, zoom: 13, };  markers: MarkerProperties[] = [ { position: { lat: 48.8584, lng: 2.2945 } }, // Eiffel Tower { position: { lat: 48.8606, lng: 2.3376 } }, // Louvre Museum { position: { lat: 48.8530, lng: 2.3499 } }, // CathÃ©drale Notre-Dame de Paris ]; ```  Html  ``` <google-map height="300px" width="100%" [options]="mapOptions"> <map-marker *ngFor="let marker of markers" [position]="marker.position""></map-marker> </agm-map> ``` |
