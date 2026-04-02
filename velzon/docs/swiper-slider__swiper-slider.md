# Swiper-Slider

Fuente: https://themesbrand.com/velzon/docs/angular/swiper-slider.html

---

#### Swiper-Slider

1. [Advance UI](javascript: void(0);)
2. Swiper-Slider

##### Overview [Official Website](https://www.npmjs.com/package/ngx-swiper-wrapper)

Swiper is the most modern slider with hardware accelerated transitions and amazing native behavior.

###### Add Package

```
npm install jquery --save
npm install slick-carousel --save
npm install ngx-slick-carousel --save
```

###### Add jquery and slick js in "scripts" at your angular.json file.

```
"scripts": [
 "node_modules/jquery/dist/jquery.min.js",
 "node_modules/slick-carousel/slick/slick.min.js"
  ]
```

###### Remove Package

```
npm uninstall ngx-slick-carousel or you can remove package by removing specific package from package.json
```

  

##### Examples:

| Title | TypeScript |
| --- | --- |
| Default Swiper | ``` slideConfig = { infinite: true, slidesToShow: 1, slidesToScroll: 1, autoplay: true, arrows: false } ``` |
| Navigation & Pagination Swiper | ``` Navigation = { infinite: false, slidesToShow: 1, slidesToScroll: 1, autoplay: true, arrows: true } ``` |
| Pagination Dynamic Swiper | ``` Pagination = { infinite: true, slidesToShow: 1, slidesToScroll: 1, autoplay: true, dots: true, autoplaySpeed: 2000, arrows: false } ``` |
| Vertical Swiper | ``` verticalConfig = { infinite: true, autoplay: true, autoplaySpeed: 2000, slidesToShow: 1, slidesToScroll: 1, arrows: false, vertical: true // Enable vertical sliding } ``` |
| Mousewheel Control Swiper | ```  carouselConfig = { slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 2000, vertical: true, arrows: false }  @HostListener('mousewheel', ['$event']) onMouseWheel(event: WheelEvent) { const delta = Math.sign(event.deltaY); if (delta > 0) {   // Scroll down (next slide)   this.slickCarousel.slickNext(); } else if (delta < 0) {   // Scroll up (previous slide)   this.slickCarousel.slickPrev(); } } ``` |
| Effect Fade Swiper | ``` fadeConfig = { infinite: true, slidesToShow: 1, slidesToScroll: 1, autoplay: true, fade: true, arrows: false } ``` |
| Effect Coverflow Swiper | ``` coverflowConfig = { slidesToShow: 3, slidesToScroll: 1, centerMode: true, centerPadding: '60px', // Adjust as needed for spacing between slides dots: true, arrows: false, autoplay: true, autoplaySpeed: 2000, } ``` |
| Responsive Breakpoints Swiper | ``` Responsive = { infinite: true, slidesToShow: 4, autoplay: true, dots: true, arrows: false }; ``` |
