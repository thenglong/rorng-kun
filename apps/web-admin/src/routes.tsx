import { lazy } from "react"

import { Navigate, RouteObject } from "react-router-dom"

import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "../config/app-config"
import AppLayout from "./components/app-layout/app-layout"
import AuthLayout from "./components/auth-layout/auth-layout"

const SignInPage = lazy(
  () => import("./components/pages/sign-in-page/sign-in-page")
)

export const getRoutes = (isAuth: boolean): RouteObject[] => {
  return [
    {
      path: "*",
      element: <Navigate to={isAuth ? APP_PREFIX_PATH : AUTH_PREFIX_PATH} />,
    },
    {
      path: APP_PREFIX_PATH,
      element: isAuth ? <AppLayout /> : <Navigate to={AUTH_PREFIX_PATH} />,
      children: [],
    },
    {
      path: AUTH_PREFIX_PATH,
      element: isAuth ? <Navigate to={APP_PREFIX_PATH} /> : <AuthLayout />,
      children: [
        {
          path: "",
          element: <Navigate to="sign-in" />,
        },
        {
          path: `${AUTH_PREFIX_PATH}/sign-in`,
          element: <SignInPage />,
        },
        {
          path: "*",
          element: "404", // TODO
        },
      ],
    },
  ]
}
