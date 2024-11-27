// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { Auth0Provider } from "@auth0/auth0-react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// keys for auth0
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// key for stripe api
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Custom redirection callback for auth0
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
    <Elements stripe={stripePromise}>
      <StrictMode>
        <App />
      </StrictMode>
    </Elements>
  </Auth0Provider>,
);
