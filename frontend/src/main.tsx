// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// Custom redirection callback
const onRedirectCallback = (appState: any) => {
  window.location.replace(appState?.returnTo || "/profile");
};

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    onRedirectCallback={onRedirectCallback}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>,
);
