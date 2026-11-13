import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PanelCoverDemo } from "./PanelCoverDemo";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {new URLSearchParams(window.location.search).has("panelCover") ? <PanelCoverDemo /> : <App />}
  </StrictMode>,
);
