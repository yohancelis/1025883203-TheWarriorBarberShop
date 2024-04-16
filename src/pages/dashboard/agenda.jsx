import React, { Fragment, useRef, useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input, Button
} from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import Axios from "axios";
import Swal from 'sweetalert2';
import {
  PencilSquareIcon, CalendarIcon
} from "@heroicons/react/24/solid";
import {
  EyeIcon
} from "@heroicons/react/24/outline";

export function Agenda() {
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

  //se crean las listas en las que se van a guardar datos de las apis
  const [serviciosList, setServiciosL] = useState([]);
  const [agendaList, setAgenda] = useState([]);
  const [empleadosList, setEmpleadosL] = useState([]);
  const [clientesList, setClientesL] = useState([]);
  const [usuariosList, setUsuariosL] = useState([]);

  //se crean variables en las que se guardan los datos de los input
  const [servicio, setServicio] = useState("");
  const [empleado, setEmpleado] = useState("");
  const [cliente, setCliente] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [valor, setValor] = useState(0);

  const [id, setId] = useState(0);
  const [edit, setEdit] = useState(false);

  const [open, setOpen] = useState(false);

  //para abrir y cerrar el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [pagina, setPagina] = useState(1);
  const [paginaElem] = useState(5);

  const ultimoElem = pagina * paginaElem;
  const primerElem = ultimoElem - paginaElem;
  const paginaActual = agendaList.slice(primerElem, ultimoElem);

  const paginate = (pageNumber) => setPagina(pageNumber);

  //funcion para vaciar las variables
  const empty = () => {
    setServicio("");
    setValor(0);
    setEmpleado("");
    setCliente("");
    setFecha("");
    setHora("");
  };
  //URL de las API
  const URLServicios = "http://localhost:8080/api/servicios";
  const URLAgenda = "http://localhost:8080/api/agenda";
  const URLEmpleados = "http://localhost:8080/api/empleados";
  const URLClientes = "http://localhost:8080/api/clientes";
  const URLUsuarios = "http://localhost:8080/api/usuarios";

  //metodos o endpoints get
  const getServicios = async () => {
    try {
      const resp = await Axios.get(URLServicios);
      const data = resp.data.servicios;
      setServiciosL(data);
    } catch (error) {
      console.error("Error al obtener datos de los servicios: ", error);
    }
  };

  const getEmpleados = async () => {
    try {
      const resp = await Axios.get(URLEmpleados);
      const data = resp.data.empleados;
      setEmpleadosL(data);
    } catch (error) {
      console.error("Error al obtener datos de los empleados: ", error);
    }
  };

  const getClientes = async () => {
    try {
      const resp = await Axios.get(URLClientes);
      const data = resp.data.clientes;
      setClientesL(data);
    } catch (error) {
      console.error("Error al obtener datos de los clientes: ", error);
    }
  };

  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuarios);
      const data = resp.data.usuarios;
      setUsuariosL(data);
    } catch (error) {
      console.error("Error al obtener datos de los usuarios: ", error);
    }
  };

  const getAgenda = async () => {
    try {
      const resp = await Axios.get(URLAgenda);
      const data = resp.data.agenda;
      setAgenda(data);
    } catch (error) {
      console.error("Error al obtener datos de la agenda: ", error);
    }
  };

  //se inicializa los metodos o endpoints get para que cargue la informacion
  useEffect(() => {
    getServicios();
    getAgenda();
    getClientes();
    getEmpleados();
    getUsuarios();
  }, []);

  //metodos o endpoints post
  const postAgenda = () => {
    //condiciones para que no haya campos vacios
    if (servicio == 0) {
      showAlert("error", "Seleccione un servicio!");
    } else if (empleado == 0) {
      showAlert("error", "El campo de empleado no puede estar vacío!");
    } else if (cliente == 0) {
      showAlert("error", "El campo de cliente no puede estar vacío!");
    } else if (!fecha) {
      showAlert("error", "El campo de fecha no puede estar vacío!");
    } else if (!hora) {
      showAlert("error", "El campo de hora no puede estar vacío!");
    } else {
      Axios.post(URLAgenda, {
        IdServicio: servicio,
        IdEmpleado: empleado,
        IdCliente: cliente,
        Estado: true,
        FechaAgenda: fecha,
        HoraAgenda: hora,
        Valor: valor,
      })
        .then(() => {
          showAlert("success", "Agenda registrada con éxito!");
          getAgenda();
          setOpen(false);
          empty();
        })
        .catch((error) => {
          showAlert("error", "Error al registrar la agenda");
          console.error("Error al registrar la agenda:", error);
        });
      setTimeout(() => {
        getAgenda();
      }, 10500);
    }
  };

  //metodos o endpoints post
  const Edit = (val) => {
    setEdit(true);
    handleShow();
    setId(val.IdAgenda);
    setServicio(val.IdServicio);
    empleadosList.filter(empl => {
      const usuario = usuariosList.find(usu => usu.IdUsuario === empl.IdUsuario && empl.IdEmpleado === val.IdEmpleado);
      return usuario && usuario.Estado;
    }).map((empl) => (
      usuariosList.find((usu) => usu.IdUsuario === empl.IdUsuario && setEmpleado(empl.IdEmpleado))
    ))
    clientesList.filter(client => {
      const usuario = usuariosList.find(usu => usu.IdUsuario === client.IdUsuario && client.IdCliente === val.IdCliente);
      return usuario && usuario.Estado;
    }).map((client) => (
      usuariosList.find((usu) => usu.IdUsuario === client.IdUsuario && setCliente(client.IdCliente))
    ))
    setFecha(val.FechaAgenda);
    setHora(val.HoraAgenda);
    setValor(val.Valor);
  };

  const putAgenda = () => {
    //condiciones para que no haya campos vacios
    if (servicio == 0) {
      showAlert("error", "Seleccione un servicio!");
    } else if (empleado == 0) {
      showAlert("error", "El campo de empleado no puede estar vacío!");
    } else if (cliente == 0) {
      showAlert("error", "El campo de cliente no puede estar vacío!");
    } else if (!fecha) {
      showAlert("error", "El campo de fecha no puede estar vacío!");
    } else if (!hora) {
      showAlert("error", "El campo de hora no puede estar vacío!");
    } else {
      Axios.put(URLAgenda, {
        IdAgenda: id,
        IdServicio: servicio,
        IdEmpleado: empleado,
        IdCliente: cliente,
        Estado: true,
        FechaAgenda: fecha,
        HoraAgenda: hora,
        Valor: valor,
      })
        .then(() => {
          showAlert("success", "Agenda actualizada con éxito!");
          getAgenda();
          setOpen(false);
          empty();
        })
        //en caso de error se muestra en la consola
        .catch((error) => {
          showAlert("error", "Error al registrar la agenda");
          console.error("Error al registrar la agenda:", error);
        });
      setTimeout(() => {
        getAgenda();
      }, 10500);
    }
  };

  // const temp = (id) => {
  //   let est = agendaList.some((agen) => (agen.IdAgenda === id && agen.Estado))
  //   if (!est) {
  //     const agen = agendaList.find((agen) => (agen.IdAgenda === id))
  //     setTimeout(() => {
  //       Axios.put(URLAgenda, {
  //         IdAgenda: id,
  //         Estado: false,
  //         IdServicio: agen.IdServicio,
  //         IdEmpleado: agen.IdEmpleado,
  //         IdCliente: agen.IdCliente,
  //         FechaAgenda: agen.FechaAgenda,
  //         HoraAgenda: agen.HoraAgenda,
  //         Valor: agen.Valor,
  //       });
  //       showAlert("success", "Estado modificado.");
  //       getAgenda();
  //     }, 6000);
  //   }
  // }

  //Cambiar estado
  const switchEstado = (id) => {
    let est = agendaList.some((agen) => (agen.IdAgenda === id && agen.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const agen = agendaList.find((agen) => (agen.IdAgenda === id))
    try {
      Axios.put(URLAgenda, {
        IdAgenda: id,
        Estado: est,
        IdServicio: agen.IdServicio,
        IdEmpleado: agen.IdEmpleado,
        IdCliente: agen.IdCliente,
        FechaAgenda: agen.FechaAgenda,
        HoraAgenda: agen.HoraAgenda,
        Valor: agen.Valor,
      });
      showAlert("success", "Estado modificado.");
      getAgenda();
    } catch (error) {
      showAlert("error", "Error al modificar el estado.");
      console.log("Error al modificar el estado: ", error);
    }
    setTimeout(() => {
      getAgenda();
    }, 10500);
  };

  const formatNumber = (number) => {
    const parts = String(number).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
  };

  const fechaActual = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Card className="formRegUsu" style={{ zIndex: edit ? 50 : 500 }}>
                    <CardHeader variant="gradient" className="mb-8 p-6 cardHeadCol">
                      <Typography variant="h6" color="white" className="text-left">
                        {edit ? "Editar agenda" : "Crear agenda"}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <select
                            label="Servicio"
                            value={servicio}
                            onChange={(event) => {
                              setServicio(event.target.value)
                              const valServicio = serviciosList.filter((servicio) => (servicio.IdServicio == event.target.value)).map((servicio) => (servicio.Precio))
                              setValor(valServicio)
                            }}
                            className="block w-full h-10 border border-gray-400 text-gray-600 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value={0}>Seleccione un servicio</option>
                            {serviciosList.map((serv) => (
                              <option key={serv.IdServicio} value={serv.IdServicio}>
                                {serv.NombreDelServicio}
                              </option>))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <select
                            label="Servicio"
                            value={empleado}
                            onChange={(event) => setEmpleado(event.target.value)}
                            className="block w-full h-10 border border-gray-400 text-gray-600 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value={0}>Seleccione un empleado</option>
                            {empleadosList.filter(empl => {
                              const usuario = usuariosList.find(usu => usu.IdUsuario === empl.IdUsuario);
                              return usuario && usuario.Estado;
                            }).map((empl) => (
                              <option key={empl.IdEmpleado} value={empl.IdEmpleado}>
                                {usuariosList.find((usu) => usu.IdUsuario === empl.IdUsuario)?.Usuario || 'No Disponible'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <select
                            label="Servicio"
                            value={cliente}
                            onChange={(event) => setCliente(event.target.value)}
                            className="block w-full h-10 border border-gray-400 text-gray-600 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value={0}>Seleccione un cliente</option>
                            {clientesList.filter(client => {
                              const usuario = usuariosList.find(usu => usu.IdUsuario === client.IdUsuario);
                              return usuario && usuario.Estado;
                            }).map((client) => (
                              <option key={client.IdCliente} value={client.IdCliente}>
                                {usuariosList.find((usu) => usu.IdUsuario === client.IdUsuario)?.Usuario || 'No Disponible'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Valor"
                            readOnly
                            disabled
                            value={`$${formatNumber(valor)}`} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Fecha"
                            value={fecha}
                            type="date"
                            min={fechaActual}
                            onChange={(event) => setFecha(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <select
                            id="hora"
                            value={hora}
                            onChange={(event) => setHora(event.target.value)}
                            className="block w-full h-10 border border-gray-400 text-gray-600 rounded px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          >
                            <option value="">Seleccione una hora</option>
                            {[...Array(12)].flatMap((_, index) => {
                              const hour = index + 8; // Empezando desde las 8:00 AM
                              return [0, 30].map(minutes => {
                                const displayHour = hour <= 12 ? hour : hour - 12; // Convertir horas de 24 a 12 horas
                                const period = hour < 12 ? "AM" : "PM"; // Determinar si es AM o PM
                                const formattedHour = `${displayHour}:${minutes === 0 ? "00" : "30"} ${period}`; // Formatear la hora
                                return <option key={`${hour}-${minutes}`} value={`${hour}:${minutes === 0 ? "00" : "30"}`}>{formattedHour}</option>;
                              });
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-center items-center mt-3">
                        <div>
                          {edit ? (
                            <Button onClick={(e) => {
                              putAgenda();
                            }} className="btnOrange text-white font-bold py-2 px-4 rounded">
                              Editar agenda
                            </Button>
                          ) : (
                            <Button onClick={(e) => {
                              postAgenda();
                            }} className="btnGreen text-white font-bold py-2 px-4 rounded">
                              Crear agenda
                            </Button>
                          )}
                          <Button onClick={(e) => {
                            setOpen(false);
                            empty();
                          }} className="btnRed text-white font-bold py-2 px-4 rounded ms-5">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 cardHeadCol">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Agenda <Button className="btnRed flex items-center border" onClick={() => { setOpen(true), setEdit(false); }}><CalendarIcon className="h-7 w-7 me-2" /> Nueva cita</Button>
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll p-0">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Servicio", "Empleado", "Cliente", "Estado", "Fecha", "Hora", "Valor", "Editar"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[13px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="IdBodyTable">
              {agendaList.map((agenda) => (
                <tr key={agenda.IdAgenda} id={`User${agenda.IdAgenda}`}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{serviciosList.find((serv) => serv.IdServicio === agenda.IdServicio)?.NombreDelServicio}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{empleadosList.map((empl) => empl.IdEmpleado === agenda.IdEmpleado && usuariosList.find((usu) => usu.IdUsuario === empl.IdUsuario)?.Usuario)}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{clientesList.map((client) => client.IdCliente === agenda.IdCliente && usuariosList.find((usu) => usu.IdUsuario === client.IdUsuario)?.Usuario)}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {agenda.Estado ? (
                      <Button onClick={() => {
                        switchEstado(agenda.IdAgenda)
                      }} className="btnGreen text-white font-bold py-2 px-4 rounded-full">
                        Activa
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        switchEstado(agenda.IdAgenda)
                      }} className="btnRed text-white font-bold py-2 px-4 rounded-full">
                        Terminada
                      </Button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{agenda.FechaAgenda}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{agenda.HoraAgenda}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">${formatNumber(agenda.Valor)}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <Button
                      onClick={() => { Edit(agenda), setOpen(true); }}
                      className="btnFunciones btnOrange"><PencilSquareIcon /></Button>
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
export default Agenda;