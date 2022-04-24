import { StrictMode } from "react"

import * as ReactDOM from "react-dom/client"

import AppProvider from "./components/app-provider/app-provider"
import App from "./components/app/app"

const rootElement = document.getElementById("rorng-korn-app") as HTMLElement

const root = ReactDOM.createRoot(rootElement)

root.render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
