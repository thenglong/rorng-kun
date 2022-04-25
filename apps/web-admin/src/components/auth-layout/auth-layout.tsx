import { Suspense } from "react"

import { Box, LoadingOverlay } from "@mantine/core"
import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <Suspense fallback={<LoadingOverlay visible />}>
      <Box sx={{ height: "100vh" }}>
        <Outlet />
      </Box>
    </Suspense>
  )
}

export default AuthLayout
