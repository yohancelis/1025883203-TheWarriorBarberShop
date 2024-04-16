import {
  Squares2X2Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  CubeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ChartBarIcon,
  
} from "@heroicons/react/24/solid";
import { Home, Rols, Proveedores, Usuarios, Compras,
  Servicios, Productos, Empleados, Agenda, Clientes, 
  Ventas, Gestionventas, GestionConceptoGasto, GastosOperativos } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [

  {
    title: "Configuración",
    layout: "dashboard",
    pages: [
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Roles",
        path: "/rols",
        element: <Rols />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Usuarios",
        path: "/usuarios",
        element: <Usuarios />,
      },
      
    ],
  },
  {
    title:"Compras",
    layout: "dashboard",
    pages: [
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Compras",
        path: "/compras",
        element: <Compras />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Productos",
        path: "/productos",
        element: <Productos/>,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Proveedores",
        path: "/proveedores",
        element: <Proveedores />,
      },
    ],
  },
  {
    title:"Servicios",
    layout: "dashboard",
    pages: [
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "Servicios",
        path: "/servicios",
        element: <Servicios />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Empleados",
        path: "/empleados",
        element: <Empleados/>,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Agenda",
        path: "/agenda",
        element: <Agenda />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Concepto de gastos",
        path: "/conceptogasto",
        element: <GestionConceptoGasto />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Gastos operativos",
        path: "/gastosoperativos",
        element: <GastosOperativos/>,
      },
    ],
  },
  {
    title: "Ventas",
    layout: "dashboard",
    pages: [
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "Ventas",
        path: "/ventas",
        element: <Ventas />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "Gestion_ventas",
        path: "/gestion_ventas",
        element: <Gestionventas />,
      },
      {
        icon: <CurrencyDollarIcon {...icon} />,
        name: "Clientes",
        path: "/clientes",
        element: <Clientes />,
      },
    ],
  },
  {
    title: "Desempeño",
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    title: "login",
    layout: "auth",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Salir",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Registro",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
