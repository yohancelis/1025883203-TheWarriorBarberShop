import React, { Fragment, useRef, useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input, Button
} from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react'
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
import { number } from "prop-types";

export function Empleados() {

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

  const [empleadosList, setEmpleadosL] = useState([]);
  const [usuariosList, setUsuariosL] = useState([]);

  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [porcentajeGanancia, setPorcentajeGanancia] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [errorUsuario, setErrorUsuario] = useState(true);
  const [errorPorcentaje, setErrorPorcentaje] = useState(true);
  const [errorNombre, setErrorNombre] = useState(true);
  const [errorApellidos, setErrorApellidos] = useState(true);
  const [errorCelular, setErrorCelular] = useState(true);
  const [errorCorreo, setErrorCorreo] = useState(true);
  const [errorPass, setErrorPass] = useState(true);
  const [errorConfirmPass, setErrorConfirmPass] = useState(true);

  const [id, setId] = useState(0);
  const [edit, setEdit] = useState(false);

  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [pagina, setPagina] = useState(1);
  const [paginaElem] = useState(5);

  const ultimoElem = pagina * paginaElem;
  const primerElem = ultimoElem - paginaElem;
  const paginaActual = empleadosList.slice(primerElem, ultimoElem);

  const paginate = (pageNumber) => setPagina(pageNumber);

  const empty = () => {
    getUsuarios();
    setUsuario("");
    setPorcentajeGanancia("");
    setNombre("");
    setApellidos("");
    setCelular("");
    setCorreo("");
    setPass("");
    setConfirmPass("");
    setVer(true);
    setEdit(false);
  };

  const URLEmpleados = "http://localhost:8080/api/empleados";
  const URLUsuarios = "http://localhost:8080/api/usuarios";

  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuarios);
      setUsuariosL(resp.data.usuarios);
    } catch (error) {
      console.error("Error al obtener datos de los usuarios:", error);
    }
    getEmpleados();
  };

  const getEmpleados = async () => {
    try {
      const resp = await Axios.get(URLEmpleados);
      setEmpleadosL(resp.data.empleados);
    } catch (error) {
      console.error("Error al obtener datos de los usuarios:", error);
    }
  };

  useEffect(() => {
    getEmpleados();
    getUsuarios();
  }, []);

  const putUsuario = () => {
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valPorGan = /^[0-9]{2}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,30}$/;
    setErrorUsuario(true);
    setErrorPorcentaje(true);
    setErrorNombre(true);
    setErrorApellidos(true);
    setErrorCelular(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (usuario != usuario.match(valUsu)) {
      showAlert("error", "Ingrese un nombre de usuario válido!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario) && usuario !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Usuario).toString()) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
    } else if (!porcentajeGanancia) {
      showAlert("error", "Ingrese un porcentaje de ganancia!");
      setErrorPorcentaje(false);
    } else if (porcentajeGanancia != porcentajeGanancia.match(valPorGan)) {
      showAlert("error", "Ingrese un porcentaje de ganancia válido!");
      setErrorNombre(false);
    } else if (!nombre) {
      showAlert("error", "Ingrese su nombre!");
      setErrorNombre(false);
    } else if (nombre != nombre.match(valNomApe)) {
      showAlert("error", "Ingrese un nombre válido!");
      setErrorNombre(false);
    } else if (!apellidos) {
      showAlert("error", "Ingrese sus apellidos!");
      setErrorApellidos(false);
    } else if (apellidos != apellidos.match(valNomApe)) {
      showAlert("error", "Ingrese apellidos válido!");
      setErrorApellidos(false);
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (celular != celular.match(valCel)) {
      showAlert("error", "Ingrese un número de celular válido!");
      setErrorCelular(false);
    } else if (usuariosList.map((user) => user.Celular).includes(celular) && celular !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Celular).toString()) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
    } else if (!correo) {
      showAlert("error", "Ingrese un correo!");
      setErrorCorreo(false);
    } else if (correo != correo.match(valEm)) {
      showAlert("error", "Ingrese un correo válido!");
      setErrorCorreo(false);
    } else if (usuariosList.map((user) => user.Correo).includes(correo) && correo !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Correo).toString()) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!pass) {
      showAlert("error", "Ingrese una contraseña!");
      setErrorPass(false);
    } else if (pass != pass.match(valPa)) {
      showAlert("error", "Ingrese una contraseña válida!");
      setErrorPass(false);
    } else if (confirmPass != pass) {
      showAlert("error", "Las contraseñas deben ser iguales!");
      setErrorPass(false);
      setErrorConfirmPass(false);
    } else {
      setOpen(false);
      Axios.put(URLUsuarios, {
        IdUsuario: id,
        IdRol: 2,
        Usuario: usuario,
        Estado: true,
        Nombre: nombre,
        Apellidos: apellidos,
        Celular: parseInt(celular),
        Correo: correo,
        Pass: pass,
      })
        .then(() => {
          const existeEmpl = parseInt(empleadosList.filter(empl => empl.IdUsuario == id).map(empl => empl.IdEmpleado));
          showAlert("success", "Usuario actualizado con éxito!");
          Axios.put(URLEmpleados, {
            IdEmpleado: existeEmpl,
            PorcentajeGanancias: porcentajeGanancia,
          }).catch((error) => {
            showAlert("error", "Error al enviar el empleado");
            console.error("Error al enviar el empleado:", error);
          });
          empty();
        })
        .catch((error) => {
          showAlert("error", "error al actualizar el usuario");
          console.error("Error al actualizar el usuario:", error);
        });
    }
  }

  const Edit = (val) => {
    scrollTop();
    setEdit(true);
    setErrorUsuario(true);
    setErrorPorcentaje(true);
    setErrorNombre(true);
    setErrorApellidos(true);
    setErrorCelular(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    setId(val.IdUsuario)
    setUsuario(usuariosList.filter(user => user.IdUsuario == val.IdUsuario).map(user => user.Usuario).toString());
    setNombre(usuariosList.filter(user => user.IdUsuario == val.IdUsuario).map(user => user.Nombre).toString());
    setApellidos(usuariosList.filter(user => user.IdUsuario == val.IdUsuario).map(user => user.Apellidos).toString());
    setCorreo(usuariosList.filter(user => user.IdUsuario == val.IdUsuario).map(user => user.Correo).toString());
    setCelular(usuariosList.filter(user => user.IdUsuario == val.IdUsuario).map(user => user.Celular).toString());
    setPorcentajeGanancia(val.PorcentajeGanancias.toString());
    setPass(usuariosList.filter(user => user.IdUsuario == val.IdUsuario).map(user => user.Pass).toString());
  };

  const [ver, setVer] = useState(true);
  const toggleVer = () => {
    setVer(!ver)
  }

  //Cambiar estado
  const switchEstado = (id) => {
    if (usuariosList.some((user) => (user.IdUsuario === id && user.IdUsuario === 1))) {
      showAlert("error", "Este usuario no se puede desactivar!");
      return;
    }
    let est = usuariosList.some((user) => (user.IdUsuario === id && user.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const user = usuariosList.find((user) => (user.IdUsuario === id))
    try {
      Axios.put(URLUsuarios, {
        IdUsuario: id,
        IdRol: user.IdRol,
        Usuario: user.Usuario,
        Estado: est,
        Nombre: user.Nombre,
        Apellidos: user.Apellidos,
        Celular: user.Celular,
        Correo: user.Correo,
        Pass: user.Pass
      });
      showAlert("success", "Estado modificado.");
      getUsuarios();
    } catch (error) {
      showAlert("error", "Error al modificar el estado.");
      console.log("Error al modificar el estado: ", error);
    }
  };

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
                  <Card className="formRegUsu" style={{ zIndex: edit ? 50 : 500 }}>
                    <CardHeader variant="gradient" className="mb-8 p-6 cardHeadCol">
                      <Typography variant="h6" color="white" className="text-left">
                        Editar empleado
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <Input
                            label="Usuario"
                            value={usuario}
                            onChange={(event) => setUsuario(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Nombre"
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Apellido"
                            value={apellidos}
                            onChange={(event) => setApellidos(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Celular"
                            value={celular}
                            onChange={(event) => setCelular(event.target.value)}
                            type="number" />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Correo"
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            type="email" />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Porcentaje ganancia"
                            value={porcentajeGanancia}
                            onChange={(event) => setPorcentajeGanancia(event.target.value)}
                            type="number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="col-span-1 flex items-center relative">
                          <Input
                            label="Contraseña"
                            value={pass}
                            onChange={(event) => setPass(event.target.value)}
                            type={ver ? "password" : "text"} />
                          <button className="ml-2 text-black relative right-10" onClick={toggleVer}>{ver ? <EyeIcon className="h-5" /> : <EyeSlashIcon className="h-5" />}</button>
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Confirmar contraseña"
                            value={confirmPass}
                            onChange={(event) => setConfirmPass(event.target.value)}
                            type={ver ? "password" : "text"} />
                        </div>
                      </div>
                      <div className="flex justify-center items-center mt-3">
                        <div>
                          <Button onClick={(e) => {
                            putUsuario();
                          }} className="btnOrange text-white font-bold py-2 px-4 rounded me-5">
                            Editar empleado
                          </Button>
                          <Button onClick={(e) => {
                            setOpen(false);
                            empty();
                          }} className="btnRed text-white font-bold py-2 px-4 rounded">
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
        <CardHeader variant="gradient" className="mb-8 p-6 cardHeadCol">
          <Typography variant="h6" color="white">
            Empleados
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll p-0">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Usuario", "Estado", "Nombre", "Apellido", "Celular", "Correo", "Porcentaje de ganancia", "Editar"].map((el) => (
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
              {empleadosList.map((empleado) => (
                <tr key={empleado.IdUsuario} id={`User${empleado.IdUsuario}`}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{usuariosList.find((usuario) => usuario.IdUsuario === empleado.IdUsuario)?.Usuario}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {usuariosList.find((usuario) => usuario.IdUsuario === empleado.IdUsuario)?.Estado ? (
                      <Button onClick={() => {
                        switchEstado(empleado.IdUsuario)
                      }} className="btnGreen text-white font-bold py-2 px-4 rounded-full">
                        Activo
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        switchEstado(empleado.IdUsuario)
                      }} className="btnRed text-white font-bold py-2 px-4 rounded-full">
                        Inactivo
                      </Button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{usuariosList.find((usuario) => usuario.IdUsuario === empleado.IdUsuario)?.Nombre}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{usuariosList.find((usuario) => usuario.IdUsuario === empleado.IdUsuario)?.Apellidos}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{usuariosList.find((usuario) => usuario.IdUsuario === empleado.IdUsuario)?.Celular}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{usuariosList.find((usuario) => usuario.IdUsuario === empleado.IdUsuario)?.Correo}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{empleado.PorcentajeGanancias}%</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <Button
                      onClick={() => { Edit(empleado), setOpen(true) }}
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
export default Empleados;