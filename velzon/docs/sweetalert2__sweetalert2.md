# SWEETALERT2

Fuente: https://themesbrand.com/velzon/docs/angular/sweetalert2.html

---

#### SWEETALERT2

1. [Advance UI](javascript: void(0);)
2. SWEETALERT2

##### Overview [Official Website](https://www.npmjs.com/package/sweetalert2)

A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes.

###### Import

```
import Swal from 'sweetalert2';
```

###### Add Package

```
npm install sweetalert2 --save
```

###### Remove Package

```
npm uninstall sweetalert2 or you can remove package by removing specific package from package.json.
```

##### Examples:

| Title | Typescript |
| --- | --- |
| A Basic Message | ``` Swal.fire({     text: 'Any fool can use a computer',     customClass: {         confirmButton: 'btn btn-primary px-4',     },     buttonsStyling: false, }); ``` |
| A Title with a Text Under | ``` Swal.fire({ title: "The Internet?", text: 'That thing is still around?', icon: 'question', iconColor: '#1ea6d3', buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary px-4', }, }); ``` |
| A Success message! | ``` Swal.fire({ title: 'Good job!', text: 'You clicked the button!', icon: 'success', showCancelButton: true, confirmButtonText: 'OK', buttonsStyling: false,  customClass: {     confirmButton: 'btn btn-primary px-4',     cancelButton: 'btn btn-danger ms-2 px-4',  }, }); ``` |
| A Modal with a title, an error icon, a text, and a footer | ``` Swal.fire({ title: 'Oops...', text: 'Something went wrong!', icon: 'error', footer: 'Why do I have this issue?', confirmButtonText: 'OK', customClass: {     confirmButton: 'btn btn-primary px-4' }, buttonsStyling: false, footer: 'Why do I have this issue?', }).then((result) => {     if (result.value) {         Swal.fire({         title: 'Deleted!',         text: 'Your file has been deleted.',         buttonsStyling: false,         icon: 'success',         customClass: {             confirmButton: 'btn btn-primary px-4'         },         });      } }); ``` |
| A Modal window with a long content inside | ``` Swal.fire({ imageUrl: 'https://placeholder.pics/svg/300x1500', imageHeight: 1500, confirmButtonText: 'Yes, delete it!', showLoaderOnConfirm: true, allowOutsideClick: false, buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary px-4'     }, }); ``` |
| A Warning message, with a function attached to the "Confirm"-button... | ``` Swal.fire({ title: "Are you sure?", text: "You won't be able to revert this!", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!", buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary px-4',     cancelButton: 'btn btn-danger ms-2 px-4',     }, }).then((result) { if (result.value) { Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', buttonsStyling: false }) } }); ``` |
| By passing a parameter, you can execute something else for "Cancel". | ``` Swal.fire({ title: "Are you sure?", text: "You won't be able to revert this!", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!", buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary px-4',     cancelButton: 'btn btn-danger ms-2 px-4',     }, }).then((result) { if (result.value) { Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', buttonsStyling: false }) } }); ``` |
| A message with custom Image Header. | ``` Swal.fire({ title: 'Sweet!', text: 'Modal with a custom image.', imageUrl: 'assets/images/logo-sm.png', imageHeight: 40, buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary px-4',     }, }); ``` |
| A message with auto close timer. | ``` let timerInterval; Swal.fire({ title: 'Auto close alert!', html: 'I will close in  seconds.', timer: 2000, timerProgressBar: true, buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary px-4'     },     didOpen: () => {     // Swal.showLoading();     timerInterval = setInterval(() => {         const content = Swal.getHtmlContainer();         if (content) {         const b: any = content.querySelector('b');         if (b) {             b.textContent = Swal.getTimerLeft();         }         }     }, 100);     },     willClose: () => {     clearInterval(timerInterval);     }, }).then((result) => {     /* Read more about handling dismissals below */     if (result.dismiss === Swal.DismissReason.timer) {     } }); ``` |
| Custom HTML description and buttons. | ``` Swal.fire({ title: 'HTML example', icon: 'info', html: 'You can use bold text, ' + 'links ' + 'and other HTML tags', showCloseButton: true, showCancelButton: true, focusConfirm: false, confirmButtonText: ' Great!', confirmButtonAriaLabel: 'Thumbs up, great!', cancelButtonText: '', buttonsStyling: false, customClass: {     confirmButton: 'btn btn-success px-4',     cancelButton: 'btn btn-danger ms-2 px-4',     }, }); ``` |
| A dialog with three buttons. | ``` const swalWithBootstrapButtons = Swal.mixin({ customClass: {     confirmButton: 'btn btn-success',     cancelButton: 'btn btn-danger ms-2 px-4',     denyButton: 'btn btn-info ms-2 px-4', }, buttonsStyling: false, });  swalWithBootstrapButtons .fire({     title: 'Do you want to save the changes?',     confirmButtonText: 'Save',     denyButtonText: "Don't save",     cancelButtonText: 'Cancel',     showCancelButton: true,     buttonsStyling: false,     customClass: {     confirmButton: 'btn btn-primary',     cancelButton: 'btn btn-danger ms-2 px-4',     denyButton: 'btn btn-info ms-2 px-4'     }, }) .then((result) => {     if (result.value) {     Swal.fire({         title: 'Saved!',         icon: 'success',         buttonsStyling: false,     });     } else if (     /* Read more about handling dismissals below */     result.dismiss === Swal.DismissReason.cancel     ) {     Swal.fire({         title: 'Cancelled',         icon: 'error',         buttonsStyling: false,     });     } }); ``` |
| A custom positioned dialog. | ``` Swal.fire({ position: 'top-end', icon: 'success', title: 'Your work has been saved', showConfirmButton: false, timer: 1500, buttonsStyling: false, }); ``` |
| A message with custom width, padding and background. | ``` Swal.fire({ title: 'Custom width, padding, background.', width: 600, padding: 100, background: '#ffff', buttonsStyling: false, customClass: {     confirmButton: 'btn btn-primary'     }, }); ``` |
| Ajax request example. | ``` Swal.fire({ title: 'Submit email to run ajax request', input: 'email', showCancelButton: true, confirmButtonText: 'Submit', showLoaderOnConfirm: true, customClass: {     confirmButton: 'btn btn-primary',     cancelButton: 'btn btn-danger ms-2 px-4',     }, buttonsStyling: false, preConfirm: (email) => {     // eslint-disable-next-line no-unused-vars     return new Promise((resolve, reject) => {         setTimeout(() => {         if (email === 'taken@example.com') {             Promise.reject(new Error('This email is already taken.'));         } else {             resolve();         }         }, 2000);     });     },      allowOutsideClick: false, }).then((email) => {     Swal.fire({     icon: 'success',     title: 'Ajax request finished!',     confirmButtonColor: '#4b93ff',     customClass: {         confirmButton: 'btn btn-success'     },     html: 'Submitted email: ' + email,     buttonsStyling: false,     }); }); ``` |
