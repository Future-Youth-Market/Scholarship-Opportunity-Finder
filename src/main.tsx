import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/open-sauce-one/latin-400.css";
import "@fontsource/open-sauce-one/latin-500.css";
import "@fontsource/open-sauce-one/latin-700.css";
import "./index.css";
import App from "./App";
import scholarships, { preview, dataError } from "virtual:fym-data";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App
        scholarships={scholarships}
        preview={preview}
        dataError={dataError}
      />
    </BrowserRouter>
  </StrictMode>,
);
