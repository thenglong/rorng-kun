import { Button } from "@mantine/core"
import { useRoutes } from "react-router-dom"

import { getRoutes } from "../../routes"

export function App() {
  const routes = getRoutes(!!firebaseUser)
  const router = useRoutes(routes)

  return <Button>Have</Button>
}

export default App
