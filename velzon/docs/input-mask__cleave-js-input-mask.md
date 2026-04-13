# Cleave.js-Input Mask

Fuente: https://themesbrand.com/velzon/docs/angular/input-mask.html

---

#### Cleave.js-Input Mask

1. [Forms](javascript: void(0);)
2. Cleave.js-Input Mask

##### Overview[Official Website](https://www.npmjs.com/package/ngx-mask)

Cleave.js javaScript library for formatting input text content when you are typing.

###### Add Package

```
npm install ngx-mask --save
```

###### Remove Package

```
npm uninstall ngx-mask or you can remove package by removing specific package from package.json
```

##### Date Formatting:

| Title | Template |
| --- | --- |
| Date | ``` <input type="text" class="form-control" mask="00/00/0000" placeholder="DD-MM-YYYY" id="cleave-date"> ``` |
| Date Formatting | ``` <input type="text" class="form-control" mask="00/00" placeholder="MM/YY" id="cleave-date-format"> ``` |

##### Time Formatting:

| Title | Template |
| --- | --- |
| Time | ``` <input type="text" class="form-control" mask="00:00:00" placeholder="hh:mm:ss" id="cleave-time"> ``` |
| Time Formatting | ``` <input type="text" class="form-control" mask="00:00" placeholder="hh:mm" id="cleave-time-format"> ``` |

##### Custom Option:

| Title | Template |
| --- | --- |
| Credit Card | ``` <input type="text" class="form-control" id="cleave-ccard" mask="0000 0000 0000 0000" placeholder="xxxx xxxx xxxx xxxx"> ``` |
| Delimiter | ``` <input type="text" class="form-control" id="cleave-delimiter" mask="AAA·AAAA·AAA" [specialCharacters]="[ '[' ,']' , '·' ]" placeholder="xxx·xxx·xxx"> ``` |
| Delimiters | ``` <input type="text" class="form-control" id="cleave-delimiters" mask="AAA.AAA.AAA-AA" placeholder="xxx.xxx.xxx-xx"> ``` |
| Prefix | ``` <input type="text" class="form-control" value="PREFIX-" mask="AAAA-AAAA-AAAA-AAAA" id="cleave-prefix"> ``` |
| Phone | ``` <input type="text" class="form-control" id="cleave-phone" mask="(000)000-0000" placeholder="(xxx)xxx-xxxx"> ``` |
| Numeral Formatting | ``` <input type="number" class="form-control" placeholder="Enter numeral" id="cleave-numeral"> ``` |
