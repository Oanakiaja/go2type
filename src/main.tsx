

import { NotificationsProvider } from '@hope-ui/solid'
import { render } from "solid-js/web";
import { HopeProvider } from '@hope-ui/solid'
import App from './App'
import { initMonacoWorkerConfig } from './tools/monaco';
import "./main.css"
initMonacoWorkerConfig()
render(
  () => <HopeProvider>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </HopeProvider>,
  document.body);