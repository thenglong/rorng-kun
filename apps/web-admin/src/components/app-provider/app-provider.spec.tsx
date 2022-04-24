import { render } from "@testing-library/react"

import AppProvider from "./app-provider"

describe("AppProvider", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AppProvider>heloo</AppProvider>)
    expect(baseElement).toBeTruthy()
  })
})
