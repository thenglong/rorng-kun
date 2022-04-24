import { ReactNode } from "react"

import { MantineProvider } from "@mantine/core"
import { BrowserRouter } from "react-router-dom"

export interface AppProviderProps {
  children: ReactNode
}

/**
 * component that wraps the app and provides the MANTINE and other contexts
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <BrowserRouter>
      <MantineProvider theme={{}}>{children}</MantineProvider>
    </BrowserRouter>
  )
}

export default AppProvider
