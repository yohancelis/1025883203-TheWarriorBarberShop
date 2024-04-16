import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input, 
} from "@material-tailwind/react";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';




//iconos
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/solid";

export function Ventas() {
  const navigate = useNavigate();

  //funcion para las alertas
  function showAlert(icon = "success", title) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: title
    });
  }

  // Estados y métodos para la gestión de datos
  const [ventasList, setVentasL] = useState([]);
  const [empleadosList, setEmpleadosL] = useState([]);
  const [clientesList, setClientesL] = useState([]);
  const [usuariosList, setUsuariosL] = useState([]);
  const [serviciosList, setServiciosL] = useState([]);

  const [numfactura, setNumFactura] = useState("");
  const [servicio, setServicios] = useState("");
  const [empleado, setEmpleado] = useState("");
  const [cliente, setCliente] = useState("");
  const [FechaRegistro, setFechaRegistro] = useState ("");

  
  const [preciototal, setPrecioTotal] = useState(0);

  const [ventasTabla, setVentasLTabla] = useState([]);



  // URLs de las APIs
  const URLVentas = "http://localhost:8080/api/ventas";
  const URLServicios = "http://localhost:8080/api/servicios";
  const URLVentxServ = "http://localhost:8080/api/ventasxservicios";
  const URLEmpleados = "http://localhost:8080/api/empleados";
  const URLClientes = "http://localhost:8080/api/clientes";
  const URLUsuarios = "http://localhost:8080/api/usuarios";

  // Métodos para obtener datos de la API
  const getEmpleados = async () => {
    try {
      const resp = await Axios.get(URLEmpleados);
      setEmpleadosL(resp.data.empleados);
    } catch (error) {
      showAlert("error", "Error al obtener datos de los empleados");
    }
  };

  const getServicios = async () => {
    try {
      const resp = await Axios.get(URLServicios);
      setServiciosL(resp.data.servicios);
    } catch (error) {
      console.error("Error al obtener datos de los servicios:", error);
    }
  };

  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuarios);
      setUsuariosL(resp.data.usuarios);
    } catch (error) {
      console.error("Error al obtener datos de los usuarios:", error);
    }
  };

  const getClientes = async () => {
    try {
      const resp = await Axios.get(URLClientes);
      setClientesL(resp.data.clientes);
    } catch (error) {
      console.error("Error al obtener datos de los clientes:", error);
    }
  };

  const getVentas = async () => {
    try {
      const resp = await Axios.get(URLVentas);
      setVentasL(resp.data.ventas);
    } catch (error) {
      console.error("Error al obtener datos de la venta: ", error);
    }
  };

  useEffect(() => {
    getClientes();
    getEmpleados();
    getVentas();
    getUsuarios();
    getServicios();
  }, []);

  // Verificar si los campos necesarios están llenos
  const agregarVentaATabla = () => {
    if (!numfactura || !empleado || !cliente || !servicio) {
      showAlert("error", "Por favor complete todos los campos");
      return;
      //el método some verifica si algún elemento del array "ventasTabla" tiene el mismo servicio que se está intentando agregar. Si encuentra una coincidencia, significa que el servicio ya está presente, el método some devuelve un valor booleano.
    } else if (ventasTabla.some((serv) => (serv.servicio === servicio))) {
      showAlert("error", "Ese servicio ya está agregado.");
      return;
    }
    const pre = serviciosList.find((serv) => (parseInt(serv.IdServicio) == parseInt(servicio) && serv?.Precio)).Precio;
    setPrecioTotal(preciototal + pre);
    // Crear un objeto con los datos de la venta
    const nuevaVenta = {
      numfactura: numfactura,
      servicio: servicio,
      cliente: cliente,
      empleado: empleado,
      preciototal: pre
    };
    // Agregar la nueva venta a la tabla. El operador de propagación, o spread operator '...', es una característica de JavaScript para descomponer arrays u objetos.
    setVentasLTabla([...ventasTabla, nuevaVenta]);
    setServicios("");
    showAlert("success", "Venta agregada a la tabla.");
  };

  const postVenta = () => {
    if (ventasTabla == "") {
      showAlert("error", "La tabla está vacía!");
      return;
    }
    showAlert("success", "Venta registrada exitosamente.");
    setNumFactura(0)
    setServicios("")
    setEmpleado("")
    setCliente("")
    setFechaRegistro("")
    setPrecioTotal(0)
    setVentasLTabla([]);
    ventasTabla.map((venta) => (
      Axios.post(URLVentas, {
        CodFactura: venta.numfactura,
        IdServicio: venta.servicio,
        IdEmpleado: venta.empleado,
        IdCliente: venta.cliente,
        FechaRegistro: venta.FechaRegistro,
        PrecioTotal: venta.preciototal
      }).then(() => {
        console.log(numfactura)
        // Consulta para obtener el ID del usuario recién creado
        Axios.get(URLVentas + `/${numfactura}`).then((response) => {
          const nuevoCodFactura = response.data.ventas.IdVenta;
          const servicio = response.data.ventas.IdServicio;
          // Luego de obtener el ID del nuevo usuario, crear el cliente con ese ID
          Axios.post(URLVentxServ, {
            IdVenta: nuevoCodFactura,
            IdServicio: servicio
          }).catch((error) => {
            showAlert("error", "Error al enviar el cliente");
            console.error("Error al enviar el cliente:", error);
          })
        }).catch((error) => {
          showAlert("error", "Error al obtener el ID del usuario recién creado");
          console.error("Error al obtener el ID del usuario:", error);
        });
        getUsuarios();
        // función que vacía las variables
        empty();
      })
    )).then(() => {
      setTimeout(() => {
        navigate("/ventas");
      }, 500)
    })
  }
  function GetUserByUsername() {

  }



  const delServ = (servicio) => {
    ventasTabla.filter(venta => {
      venta.preciototal !== servicio.preciototal
      return (setPrecioTotal(preciototal - servicio.preciototal))
    })
    setVentasLTabla(ventasTabla.filter(venta => venta.servicio !== servicio.servicio));
  };

  const formatNumber = (number) => {
    const parts = String(number).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
  };


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <button onClick={() => navigate('../gestion_ventas')}
     className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear una Venta
              </button>
     
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Ventas
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["#", "CodFactura", "Fecha de Registro", "Precio Total", "Acciones"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventasList.map((venta) => (
                <tr key={venta.IdVenta}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{venta.IdVenta}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{venta.CodFactura}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{venta.FechaRegistro}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{venta.PrecioTotal}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button
                      onClick={() => { Edit(user) }}
                      className="text-xs font-semibold btnFunciones h-6 w-6 text-orange-700 hover:text-orange-900"><PencilSquareIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </CardBody>
      </Card>
      
    </div>
  );
}
export default Ventas;