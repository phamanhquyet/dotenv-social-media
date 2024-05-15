import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./lib/react-query/QueryProvider";
import { StyleSheetManager } from "styled-components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "shake"}>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </StyleSheetManager>
  </BrowserRouter>
);
