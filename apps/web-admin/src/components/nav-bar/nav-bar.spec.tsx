import { render } from "@testing-library/react"

import NavBar from "./nav-bar"

describe("NavBar", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<NavBar />)
    expect(baseElement).toBeTruthy()
  })
})
