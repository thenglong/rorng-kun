import { act, renderHook } from "@testing-library/react"
import * as React from "react"

import useAuthState from "./use-auth-state"

describe("useAuthState", () => {
  it("should render successfully", () => {
    const { result } = renderHook(() => useAuthState())

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
