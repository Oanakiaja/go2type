import { render } from "solid-js/web";
import App from './App'
import { initMonacoWorkerConfig } from './tools/monaco';
import "./main.css"
initMonacoWorkerConfig()
render(App, document.body);