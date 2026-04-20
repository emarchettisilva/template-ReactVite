import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { UsuarioProvider } from "./contexts/UsuarioContext";
import { MensagemProvider } from "./contexts/MensagemContext";
import { LoadingProvider } from "./hooks/contexts/LoadingContext";
import ErrorBoundary from "./auth/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LoadingProvider>
        <MensagemProvider>
          <UsuarioProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UsuarioProvider>
        </MensagemProvider>
      </LoadingProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
