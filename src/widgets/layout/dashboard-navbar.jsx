import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import React, { useState, useEffect } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const [hora2, setHora2] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setHora2(new Date());
    }, 1000); // Actualiza la hora cada segundo
    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []); // Se ejecuta solo una vez al montar el componente
  // Formatea la hora en formato hh:mm:ss
  const horaFormateada = hora2.toLocaleTimeString([], { /*hour: '2-digit', minute: '2-digit', second: '2-digit',*/ hour12: true });

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize flex items-center">
          <IconButton
            variant="text"
            color="red"
            className="grid xl:hidden me-10"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-7 w-7 text-black" />
          </IconButton>
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="h6"
              color="blue-gray"
            >
              {page}
            </Typography>
            <p><strong>Hora: </strong>{horaFormateada}</p>
          </Breadcrumbs>
        </div>
        <div className="flex items-center">
          {/* <Link to="/auth/sign-in">
            <IconButton
              variant="text"
              color="red"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-black" />
            </IconButton>
          </Link> */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="red">
                <UserCircleIcon className="h-7 w-7 text-black" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <Link to="/dashboard/profile">
                <MenuItem className="flex items-center gap-2">
                  <UserCircleIcon
                    className="h-7 w-h-7 text-black"
                    alt="item-1"
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography
                      variant="small"
                      color="black"
                      className="mb-1 font-normal"
                    >
                      <strong>Perfil</strong>
                    </Typography>
                  </div>
                </MenuItem>
              </Link>
              <Link to="/auth/sign-in">
                <MenuItem className="flex items-center gap-2">
                  <UserCircleIcon
                    className="h-7 w-h-7 text-black"
                    alt="item-1"
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography
                      variant="small"
                      color="black"
                      className="mb-1 font-normal"
                    >
                      <strong>Salir</strong>
                    </Typography>
                  </div>
                </MenuItem>
              </Link>
              {/* <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem> */}
            </MenuList>
          </Menu>
          {/* <IconButton
            variant="text"
            color="red"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-black" />
          </IconButton> */}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
