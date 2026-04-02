# Navigation

Fuente: https://themesbrand.com/velzon/docs/angular/navigation.html

---

#### Navigation

1. [Docs](javascript: void(0);)
2. Navigation

#### Navigation

You can change or customize the left side navigation very
easily.

#### How to add new menu items/change menu items?

In order to add, change or remove menu items from the
left side navigation, simply edit in file `/src/app/layouts/sidebar/menu.ts`.

#### How to add Menu Title?

Add Menu label and isHeader property pass in the JSON object.

```
{
  label: "MENUITEMS.MENU.TEXT",
  isTitle: true
}
```

#### How to add Single Menu Item ?

Add Menu id, label, icon, link and click function(for collapse menu) property pass in the JSON object.

```
{
  id: "1",
  label: "MENUITEMS.WIDGETS.TEXT",
  icon: "ri-honour-line",
  link: "/widgets"
  }
}
```

#### How to add Nested Menu Item ?

Add Menu id, label, icon, link, stateVariables, click function(for collapse menu) and ismainMenu property pass in the JSON object.

```
{
  id: 2,
  label: 'MENUITEMS.DASHBOARD.TEXT',
  icon: 'ri-dashboard-2-line',
  subItems: [
    {
      id: 3,
      label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
      link: '/analytics',
      parentId: 2
    },
    {
      id: 4,
      label: 'MENUITEMS.DASHBOARD.LIST.CRM',
      link: '/crm',
      parentId: 2
    },
    {
      id: 5,
      label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
      link: '',
      parentId: 2
    },
    {
      id: 6,
      label: 'MENUITEMS.DASHBOARD.LIST.CRYPTO',
      link: '/crypto',
      parentId: 2
    },
    {
      id: 7,
      label: 'MENUITEMS.DASHBOARD.LIST.PROJECTS',
      link: '/projects',
      parentId: 2
    }
  ]
},
```
