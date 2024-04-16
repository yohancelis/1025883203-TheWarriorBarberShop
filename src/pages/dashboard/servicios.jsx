import React, { Fragment, useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input, Button
} from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import Axios from "axios";
import Swal from 'sweetalert2';
import {
  PencilSquareIcon,
  TrashIcon, ScissorsIcon
} from "@heroicons/react/24/solid";
import {
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { number } from "prop-types";

export function Servicios() {

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

  const [serviciosList, setServicios] = useState([]);

  const [nomServicio, setNomServicio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [comision, setComision] = useState("");
  const [precio, setPrecio] = useState("");

  const [id, setId] = useState(0);
  const [edit, setEdit] = useState(false);

  const [open, setOpen] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [pagina, setPagina] = useState(1);
  const [paginaElem] = useState(5);

  const ultimoElem = pagina * paginaElem;
  const primerElem = ultimoElem - paginaElem;
  const paginaActual = serviciosList.slice(primerElem, ultimoElem);

  const paginate = (pageNumber) => setPagina(pageNumber);

  const empty = () => {
    setNomServicio("");
    setDescripcion("");
    setComision("");
    setPrecio("");
    setEdit(false);
  };

  const URLServicios = "http://localhost:8080/api/servicios";

  const getServicios = async () => {
    try {
      const resp = await Axios.get(URLServicios);
      const data = resp.data.servicios;
      setServicios(data);
    } catch (error) {
      console.error("Error al obtener datos de la agenda: ", error);
    }
  };

  useEffect(() => {
    getServicios();
  }, []);

  const postServicio = () => {
    if (!nomServicio) {
      showAlert("error", "El campo del nombre de servicio no puede estar vacío!");
    } else if (!precio) {
      showAlert("error", "El campo del precio no puede estar vacío!");
    } else {
      if (!descripcion) {
        setDescripcion("Sin descripción.");
      }
      Axios.post(URLServicios, {
        NombreDelServicio: nomServicio,
        Descripcion: descripcion,
        Comision: comision,
        Precio: precio
      }).then(() => {
        showAlert("success", "Servicio registrado con éxito!");
        getServicios();
        handleClose();
        empty();
      }).catch((error) => {
        showAlert("error", "Error al registrar el servicio");
        console.error("Error al registrar el servicio:", error);
      });
    }
  };

  const Reg = () => {
    setEdit(false);
    handleShow();
  };

  const Edit = (val) => {
    scrollTop();
    setEdit(true);
    handleShow();
    setId(val.IdServicio);
    setNomServicio(val.NombreDelServicio);
    setDescripcion(val.Descripcion);
    setComision(val.Comision);
    setPrecio(val.Precio);
  };

  const putServicio = () => {
    if (!nomServicio) {
      showAlert("error", "El campo del nombre de servicio no puede estar vacío!");
    } else if (!precio) {
      showAlert("error", "El campo del precio no puede estar vacío!");
    } else {
      Axios.put(URLServicios, {
        IdServicio: id,
        NombreDelServicio: nomServicio,
        Descripcion: descripcion,
        Comision: comision,
        Precio: precio
      }).then(() => {
        showAlert("success", "Servicio actualizado con éxito!");
        getServicios();
        handleClose();
        empty();
      }).catch((error) => {
        showAlert("error", "Error al actualizar el servicio");
        console.error("Error al actualizar el servicio:", error);
      });
    }
  };

  function close() {
    empty();
    handleClose();
  }

  const formatNumber = (number) => {
    const parts = String(number).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
  };

  //Función para el botón volver
  const volver = () => {
    empty();
    setEdit(false);
  }

  const scrollTop = () => {
    window.scrollTo({
      top: 1,
      behavior: 'smooth'
    });
  };

  const scrollToElement = (elementId) => {
    console.log(elementId);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                  <Card className="formRegServ">
                    <CardHeader variant="gradient" className="mb-8 p-6 cardHeadCol">
                      <Typography variant="h6" color="white">
                        {edit ? ("Editar Servicio") : ("Nuevo servicio")}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="col-span-1">
                          <Input
                            label="Nombre para el servicio"
                            value={nomServicio}
                            onChange={(event) => setNomServicio(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Descripción"
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Precio"
                            type="number"
                            value={precio}
                            onChange={(event) => setPrecio(event.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-center items-center mt-3">
                        {edit ? (
                          <div>
                            <Button onClick={() => { putServicio, setOpen(false); }}
                              className="btnOrange text-white font-bold py-2 px-4 rounded">
                              Editar servicio
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={() => { postServicio(), setOpen(false); }}
                            className="btnGreen text-white font-bold py-2 px-4 rounded">
                            Crear servicio
                          </Button>
                        )}
                        <Button onClick={(e) => {
                          setOpen(false);
                          empty();
                        }} className="btnRed text-white font-bold py-2 px-4 rounded ms-5">
                          Cancelar
                        </Button>
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
        <CardHeader variant="gradient" className="mb-8 p-6 cardHeadCol">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Servicios <Button className="btnRed flex items-center border" onClick={() => { setOpen(true), setEdit(false); }}><ScissorsIcon className="h-7 w-7 me-2" /> Nuevo servicio</Button>
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll p-0">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre del servicio", "Descripción", "Precio", "Editar"].map((el) => (
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
              {serviciosList.map((servicio) => (
                <tr key={servicio.IdServicio} id={`User${servicio.IdServicio}`}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{servicio.NombreDelServicio}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{servicio.Descripcion}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{formatNumber(`$${servicio.Precio}`)}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <Button
                      onClick={() => { Edit(servicio), setOpen(true); }}
                      className="text-xs font-semibold btnFunciones btnOrange"><PencilSquareIcon /></Button>
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
export default Servicios;