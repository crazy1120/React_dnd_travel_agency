import React from "react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import design_de from "./translations/de/design.json";
import design_en from "./translations/en/design.json";
import design_ar from "./translations/ar/design.json";
import run_de from "./translations/de/run.json";
import run_en from "./translations/en/run.json";
import run_ar from "./translations/ar/run.json";
import manage_de from "./translations/de/manage.json";
import manage_en from "./translations/en/manage.json";
import manage_ar from "./translations/ar/manage.json";
import App from "./App";

import "./index.css";
import "./styles/global-styles.css";

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      design: design_en,
      run: run_en,
      manage: manage_en,
    },
    de: {
      design: design_de,
      run: run_de,
      manage: manage_de,
    },
    ar: {
      design: design_ar,
      run: run_ar,
      manage: manage_ar,
    },
  },
});
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <I18nextProvider i18n={i18next}>
    <Router>
      <App />
    </Router>
  </I18nextProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
