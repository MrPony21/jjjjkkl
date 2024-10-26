import App from "./App"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SideBar from "./components/Sidebar";
import SideBarAdmin from "./components/SidebarAdmin";
import SidebarEmployee from "./components/SidebarEmployee";
import { Dashboard, Settings, Profile, Papelera } from "./views/Cloud";
import { ProfileAdmin, CreateUserAdmin, EditUserAdmin } from "./views/Admin";
import { ProfileEmployee, EditUserEmployee } from "./views/Employee";
import { LoginPage, RegisterPage, ForgotPassword, OTPInput, Reset } from "./views/Login";
import { Subidos } from "./views/Cloud/Subidos";
import { Recientes } from "./views/Cloud/Recientes";
export function Router() {


const router = createBrowserRouter([
    {
        path: "*",
        element: (
            <div>
              <div>
                <h1>
                  404: PAGINA NO ENCONTRADA
                </h1>
              </div>
            </div>
        ),
    },
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/registrate",
        element: <RegisterPage />,
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword />,
    },
    {
        path: "/otpInput",
        element: <OTPInput />,
    },
    {
        path: "/reset",
        element: <Reset />,
    },
    {
        path: "/cloud",
        element: <SideBar/>,
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: "/cloud/papelera",
                element: <Papelera/>
            },
            {
                path: "/cloud/ajustes",
                element: <Settings />
            },
            {
                path: "/cloud/usuario",
                element: <Profile />
            },
            {
                path: "/cloud/subidos",
                element: <Subidos/>
            },
            {
                path: "/cloud/recientes",
                element: <Recientes/>
            }
        ]
    },
    {
        path: "/admin",
        element: <SideBarAdmin />,
        children: [
            {
                index: true,
                element: <ProfileAdmin />
            },
            {
                path: "/admin/crear",
                element: <CreateUserAdmin />
            },
            {
                path: "/admin/editar",
                element: <EditUserAdmin />
            },
        ]
    },
    {
        path: "/empleado",
        element: <SidebarEmployee/>,
        children: [
            {
                index: true,
                element: <ProfileEmployee />
            },
            {
                path: "/empleado/editar",
                element: <EditUserEmployee />
            },
        ]
    }
]);
    return (<RouterProvider router={router} />)
}