import { createApp } from 'vue'
import './style.scss'

//
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css"; //https://stackoverflow.com/questions/63216712/use-bootstrap-icons-with-npm

import { TextBoxPlugin,TextBoxComponent } from '@syncfusion/ej2-vue-inputs';
import { CheckBoxPlugin,CheckBoxComponent } from '@syncfusion/ej2-vue-buttons';
import { ButtonPlugin,ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import { registerLicense } from "@syncfusion/ej2-base";
import { enableRipple } from '@syncfusion/ej2-base';
import { NumericTextBoxComponent, NumericTextBoxPlugin } from '@syncfusion/ej2-vue-inputs';


//


import App from './App.vue'

//

//
import lodash from 'lodash'

// name is optional


registerLicense(
    "ORg4AjUWIQA/Gnt2VVhjQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0VgWH9ZdHFVQGhVUUM="
);
enableRipple(true);


createApp(App)
    .component(TextBoxPlugin.name,TextBoxComponent)
    .component(CheckBoxPlugin.name,CheckBoxComponent)
    .component(ButtonPlugin.name,ButtonComponent)
    .component(NumericTextBoxPlugin.name, NumericTextBoxComponent)
    .mount('#app')
