import { Button } from "@mantine/core"

export function App() {
  // const routes = getRoutes(!!firebaseUser)
  // const router = useRoutes(routes)

  return (
    <>
      <Button>REACT_APP_VAR {process.env.REACT_APP_VAR}</Button>
      <Button>APP_VAR {process.env.APP_VAR}</Button>
      <Button>NX_VAR {process.env.NX_VAR}</Button>
    </>
  )
}

export default App
