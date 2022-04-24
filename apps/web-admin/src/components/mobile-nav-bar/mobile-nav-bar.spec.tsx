import { render } from "@testing-library/react"

import MobileNavBar from "./mobile-nav-bar"

describe("MobileNavBar", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MobileNavBar />)
    expect(baseElement).toBeTruthy()
  })
})
