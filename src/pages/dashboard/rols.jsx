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

export function Rols() {

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

  const [rolesList, setRolesL] = useState([]);
  const [permisosList, setPermisosL] = useState([]);
  const [rolesxPermisosList, setRolesxPermisosL] = useState([]);

  const [nombreRol, setNombreRol] = useState("");
  const [estado, setEstado] = useState(true);
  const [userPerms, setUserPerms] = useState([]);

  const [editPerms, setEditPerms] = useState([]);

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
  const paginaActual = rolesList.slice(primerElem, ultimoElem);

  const paginate = (pageNumber) => setPagina(pageNumber);

  const empty = () => {
    setId("");
    setNombreRol("");
    setEstado(false);
    setUserPerms([]);
    setEditPerms([]);
  };

  const URLRols = "http://localhost:8080/api/roles";
  const URLPerms = "http://localhost:8080/api/permisos";
  const URLRolsxPerms = "http://localhost:8080/api/rolesxpermisos";

  const getRoles = async () => {
    try {
      const resp = await Axios.get(URLRols);
      setRolesL(resp.data.roles);
    } catch (error) {
      console.error("Error al obtener datos de los roles: ", error);
    }
  };

  const getPerms = async () => {
    try {
      const resp = await Axios.get(URLPerms);
      setPermisosL(resp.data.permisos);
    } catch (error) {
      console.error("Error al obtener datos de los permisos: ", error);
    }
  };

  const getRolsxPerms = async () => {
    try {
      const resp = await Axios.get(URLRolsxPerms);
      setRolesxPermisosL(resp.data.rolesxpermisos);
    } catch (error) {
      console.error("Error al obtener datos de los roles x permisos: ", error);
    }
  };

  useEffect(() => {
    getRoles();
    getPerms();
    getRolsxPerms();
  }, []);

  const postRoles = () => {
    if (!nombreRol) {
      showAlert("error", "Ingrese un nombre para el rol");
      return;
    } else if (!estado) {
      setEstado(true);
    }
    showAlert("success", "Rol registrado con éxito!");
    getRoles();
    handleClose();
    empty();
    Axios.post(URLRols, {
      NombreDelRol: nombreRol,
      Estado: estado
    }).then(() => {
      getRolById();
    }).catch((error) => {
      showAlert("error", "Error al registrar el rol");
      console.error("Error al registrar el rol:", error);
    });
  };

  function getRolById() {
    const nuevoRol = rolesList.filter((r) => (r.IdRol == id)).map((r) => (r.IdRol))[0]
    Axios.get(URLRolsxPerms + `/${nuevoRol}`).then((response) => {
      const nuevoUsuarioId = response.data.rolesxpermisos.IdRol;
      Axios.post(URLRols, {
        IdRol: nuevoUsuarioId,
        IdPermiso: 1,
      }).catch((error) => {
        showAlert("error", "Error al enviar el rol");
        console.error("Error al enviar el rol:", error);
      });
    }).catch((error) => {
      showAlert("error", "Error al obtener el ID del rol recién creado");
      console.error("Error al obtener el ID del rol:", error);
    });
    getRoles();
    empty();
  }

  const Reg = () => {
    setEdit(false);
    handleShow();
  };

  const Edit = (val) => {
    setEdit(true);
    handleShow();
    setNombreRol(val.NombreDelRol);
    setId(val.IdRol);
    const idsPerms = permisosList.map((perm) => perm.IdPermiso);
    const idsRolsxPerms = rolesxPermisosList.filter((rxp) => rxp.IdRol === val.IdRol).map((r) => r.IdPermiso);
    const permisosAsociados = idsPerms.map((permId) => idsRolsxPerms.includes(permId));
    setEditPerms(permisosAsociados);
  };

  const putRoles = () => {
    if (!nombreRol) {
      showAlert("error", "Ingrese un nombre para el rol");
      return;
    } else if (!estado) {
      setEstado(true);
    }
    showAlert("success", "Rol actualizado con éxito!");
    setOpen(false);
    Axios.put(URLRols, {
      IdRol: id,
      NombreDelRol: nombreRol,
      Estado: estado,
    }).then(() => {
      getRoles();
      empty();
    }).catch((error) => {
      showAlert("error", "Error al actualizar el rol");
      console.error("Error al actualizar el rol:", error);
    });
  };

  const switchEstado = (id) => {
    if (rolesList.some((rol) => (rol.IdRol === id && rol.IdRol === 1)) ||
      rolesList.some((rol) => (rol.IdRol === id && rol.IdRol === 2)) ||
      rolesList.some((rol) => (rol.IdRol === id && rol.IdRol === 3))) {
      showAlert("error", "Este rol no se puede desactivar!");
      return;
    }
    let est = rolesList.some((rol) => (rol.IdRol === id && rol.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    Axios.put(URLRols, {
      IdRol: id,
      Estado: est,
    });
    showAlert("success", "Estado modificado.");
    getRoles();
  };

  function close() {
    empty();
    handleClose();
  }

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
                  <Card className="formRegUsu">
                    <CardHeader variant="gradient" className="mb-8 p-6 cardHeadCol">
                      <Typography variant="h6" color="white" className="text-left">
                        Editar rol
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
                      <div className="flex justify-center grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <Input
                            label="Nombre para el rol"
                            value={nombreRol}
                            onChange={(event) => setNombreRol(event.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-center items-center mt-3">
                        <div>
                          <Button onClick={(e) => {
                            putRoles();
                          }} className="btnOrange text-white font-bold py-2 px-4 rounded me-5">
                            Editar rol
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
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 cardHeadCol">
          <Typography variant="h6" color="white">
            Roles
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll p-0">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre del rol", "Estado", "Editar"].map((el) => (
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
              {rolesList.map((rol) => (
                <tr key={rol.IdRol} id={`User${rol.IdRol}`}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{rol.NombreDelRol}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {rol.Estado ? (
                      <Button onClick={() => {
                        switchEstado(rol.IdRol)
                      }} className="btnGreen text-white font-bold py-2 px-4 rounded-full">
                        Activo
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        switchEstado(rol.IdRol)
                      }} className="btnRed text-white font-bold py-2 px-4 rounded-full">
                        Inactivo
                      </Button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <Button
                      onClick={() => { Edit(rol), setOpen(true) }}
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
export default Rols;