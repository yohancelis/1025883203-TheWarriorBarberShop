import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input,
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export function Gestionventas() {
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
    
    // Estados para la gestión de ventas
    const [ventasList, setVentasL] = useState([]);
    const [empleadosList, setEmpleadosL] = useState([]);
    const [clientesList, setClientesL] = useState([]);
    const [usuariosList, setUsuariosL] = useState([]);
    const [serviciosList, setServiciosL] = useState([]);
  
    const [numfactura, setNumFactura] = useState("");
    const [servicio, setServicios] = useState("");
    const [empleado, setEmpleado] = useState("");
    const [cliente, setCliente] = useState("");
    const [FechaRegistro, setFechaRegistro] = useState("");
    const [preciototal, setPrecioTotal] = useState(0);
  
    const [ventasTabla, setVentasLTabla] = useState([]);

  // URLs de las APIs
  const URLVentas = "http://localhost:8080/api/ventas";
  const URLServicios = "http://localhost:8080/api/servicios";
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

  const agregarVentaATabla = () => {
    if (!numfactura || !empleado || !cliente || !servicio || !FechaRegistro) {
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
      preciototal: pre,
      FechaRegistro: FechaRegistro,
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
    setPrecioTotal(0)
    setVentasLTabla([]);
    ventasTabla.map((venta) => (
      Axios.post(URLVentas, {
        CodFactura: venta.numfactura,
        IdServicio: venta.servicio,
        IdEmpleado: venta.empleado,
        IdCliente: venta.cliente,
        PrecioTotal: venta.preciototal,
        FechaRegistro: venta.FechaRegistro
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
      <Card className="formRegUsu">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Gestionar Ventas
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input
            label="Número de Factura"
            value={numfactura}
            disabled
            onChange={(event) => setNumFactura(event.target.value)} />
  
         <div className="col-span-1 flex items-center relative">
            <select
              label="servicio"
              value={servicio}
              onChange={(event) => {
                setServicios(event.target.value);
                let cod = ventasList.map((vent) => (vent.CodFactura !== undefined && vent.CodFactura)).reverse()[0];
                    setNumFactura(cod != undefined ? cod + 1 : 1000);
              }}
              className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
              <option value={0}>Seleccione un servicio</option>
              {serviciosList.map((servicio) => (
                <option
                  value={servicio.IdServicio}
                  id={servicio.IdServicio}
                  key={servicio.IdServicio}>
                  {servicio.NombreDelServicio}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="col-span-1 flex items-center relative">
            <select
              label="Empleado"
              value={empleado}
              onChange={(event) => {
                setEmpleado(event.target.value);
                let cod = ventasList.map((vent) => (vent.CodFactura !== undefined && vent.CodFactura)).reverse()[0];
                    setNumFactura(cod != undefined ? cod + 1 : 1000);
              }}
              className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
              <option value={0}>Seleccione un Empleado</option>
              {empleadosList.map((empleado) => (
                <option
                  value={empleado.IdEmpleado}
                  id={empleado.IdEmpleado}
                  key={empleado.IdEmpleado}
                >
                  {
                    usuariosList.find(
                      (usuario) => usuario.IdUsuario === empleado.IdUsuario
                    )?.Usuario
                  }
                </option>
              ))}
            </select>
          </div>

        <div className="col-span-1 flex items-center relative">
            <select
              label="Cliente"
              value={cliente}
              onChange={(event) => {
                setCliente(event.target.value);
                let cod = ventasList.map((vent) => (vent.CodFactura !== undefined && vent.CodFactura)).reverse()[0];
                setNumFactura(cod != undefined ? cod + 1 : 1000);
                
              }}
              className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
              <option value={0}>Seleccione un cliente</option>
              {clientesList.map((cliente) => (
                <option
                  value={cliente.IdCliente}
                  id={cliente.IdCliente}
                  key={cliente.IdCliente}
                >
                  {
                    usuariosList.find(
                      (usuario) => usuario.IdUsuario === cliente.IdUsuario
                    )?.Usuario
                  }
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="mt-3">
          <div className="col-span-1 flex items-center justify-center">
          <Input
            label="Precio Total"
            value={preciototal}
            disabled
            onChange={(event) => setPrecioTotal(event.target.value)} />

          <Input
            label="Fecha de Registro"
            value={FechaRegistro}
            type="date"
            onChange={(event) => setFechaRegistro(event.target.value)} />
            </div>
            </div>


          {/* Botones de acción */}
          <div className="flex justify-center items-center mt-3">
            <button  onClick={agregarVentaATabla}className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
              Agregar
            </button>
          </div>
        </CardBody>
      </Card>
  
      <div className="mt-8">
        <Typography variant="h6">Ventas Registradas</Typography>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Factura
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventasTabla.map((venta, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{venta.numfactura}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{serviciosList.map((serv) => (venta.servicio.toString() === serv.IdServicio.toString() && serv.NombreDelServicio))}</div>
                </td> 
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{venta.FechaRegistro}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(venta.preciototal)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button onClick={() => delServ(venta)} className="text-red-600 hover:text-red-900 mr-2"><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-3">
            <button onClick={postVenta} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
              Crear Venta
            </button> 
          </div>
    </div>
  );
}
  
export default Gestionventas;