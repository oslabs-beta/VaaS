import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./Components/App";
import { Provider } from "react-redux";
import { store } from "./Store/store";

const container = document.getElementById("root")!;

const FullApp = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

hydrateRoot(container, <FullApp />);

// if (import.meta.hot || !container.innerText) {
//   const root = createRoot(container);
//   root.render(<FullApp />);
// } else {
//   hydrateRoot(container, <FullApp />);
// }
