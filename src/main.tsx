import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./styles/index.css";

// Redux store init
import { Provider } from "react-redux";
import store from "./store/index.ts";

// localization init
import "/src/config/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
