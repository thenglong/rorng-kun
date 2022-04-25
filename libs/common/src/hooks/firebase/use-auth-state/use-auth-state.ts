import { useEffect, useMemo } from "react"

import { Auth, onAuthStateChanged, User } from "firebase/auth"

import { LoadingHook, useLoadingValue } from "../util"

export type AuthStateHook = LoadingHook<User | null, Error>

type AuthStateOptions = {
  onUserChanged?: (user: User | null) => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseAuthState {
  count: number
  increment: () => void
}

export function useAuthState(): UseAuthState {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    User | null,
    Error
  >(() => auth.currentUser)

  useEffect(() => {
    const listener = onAuthStateChanged(
      auth,
      async user => {
        if (options?.onUserChanged) {
          // onUserChanged function to process custom claims on any other trigger function
          try {
            await options.onUserChanged(user)
          } catch (e) {
            setError(e as Error)
          }
        }
        setValue(user)
      },
      setError
    )

    return () => {
      listener()
    }
  }, [auth])

  const resArray: AuthStateHook = [value, loading, error]
  return useMemo<AuthStateHook>(() => resArray, resArray)
}

export default useAuthState
