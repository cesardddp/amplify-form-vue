import { createApp } from 'vue'
import './style.scss'

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css"; //https://stackoverflow.com/questions/63216712/use-bootstrap-icons-with-npm

import { TextBoxPlugin, TextBoxComponent } from '@syncfusion/ej2-vue-inputs';
import { CheckBoxPlugin, CheckBoxComponent } from '@syncfusion/ej2-vue-buttons';
import { ButtonPlugin, ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import { registerLicense } from "@syncfusion/ej2-base";
import { NumericTextBoxComponent, NumericTextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { GridPlugin, GridComponent, ColumnsDirective, ColumnsPlugin, ColumnDirective, ColumnPlugin } from "@syncfusion/ej2-vue-grids";
import { 
    TabPlugin,
    TabItemPlugin,
    TabItemsPlugin,
    TabComponent,
TabItemDirective,
TabItemsDirective,
} from "@syncfusion/ej2-vue-navigations";

import App from './AppToTest.vue'

registerLicense("ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5QdEJjXnpfdXRWQWZf");
createApp(App)
    .component(TextBoxPlugin.name, TextBoxComponent)
    .component(CheckBoxPlugin.name, CheckBoxComponent)
    .component(ButtonPlugin.name, ButtonComponent)
    .component(NumericTextBoxPlugin.name, NumericTextBoxComponent)
    .component(GridPlugin.name, GridComponent)
    .component(ColumnsPlugin.name, ColumnsDirective)
    .component(ColumnPlugin.name, ColumnDirective)
    .component(TabPlugin.name,TabComponent)
    .component(TabItemPlugin.name,TabItemDirective)
    .component(TabItemsPlugin.name,TabItemsDirective)
    .mount('#app')
