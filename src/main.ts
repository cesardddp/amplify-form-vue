import { createApp } from 'vue'
import './style.scss'

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css"; //https://stackoverflow.com/questions/63216712/use-bootstrap-icons-with-npm

import { TextBoxPlugin, } from '@syncfusion/ej2-vue-inputs';
import { CheckBoxPlugin, } from '@syncfusion/ej2-vue-buttons';
import { ButtonPlugin, } from '@syncfusion/ej2-vue-buttons';
import { NumericTextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { 
    GridPlugin, 
    // ColumnsDirective, 
    // ColumnsPlugin, 
    // ColumnDirective, 
    // ColumnPlugin
 } from "@syncfusion/ej2-vue-grids";
import {
    TabPlugin,
    TabItemPlugin,
    TabItemsPlugin,
    // TabItemDirective,
    // TabItemsDirective,
} from "@syncfusion/ej2-vue-navigations";
import { vMaska } from "maska"

import App from './AppToTest.vue'
// import { Amplify } from "aws-amplify";
// import awsconfig from "./aws-exports";

// Amplify.configure(awsconfig);

createApp(App)
    .use(TextBoxPlugin)
    .use(CheckBoxPlugin)
    .use(ButtonPlugin)
    .use(NumericTextBoxPlugin)
    .use(GridPlugin)
    .use(TabPlugin)
    .use(TabItemPlugin)
    .use(TabItemsPlugin)
    // .component(ColumnsPlugin.name, ColumnsDirective)
    // .component(ColumnPlugin.name, ColumnDirective)
    .directive("maska", vMaska)
    .mount('#app')
