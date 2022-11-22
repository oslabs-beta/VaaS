import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./Components/App";
import { Provider } from "react-redux";
import { store } from "./Store/store";

export function render(url: string | Partial<Location>) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </Provider>,
  );
}
