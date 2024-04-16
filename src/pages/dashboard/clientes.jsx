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

export function Clientes() {

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

  //Listas
  const [usuariosList, setUsuariosL] = useState([]);
  const [rolesList, setRolesL] = useState([]);
  const [permisosList, setPermisosL] = useState([]);
  const [rolesPermisosList, setRolesPermisosL] = useState([]);

  //Variables
  const [roles, setRoles] = useState("");
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  //Variables para editar
  const [id, setId] = useState(0);
  const [edit, setEdit] = useState(false);

  //Variable para el buscador
  const [searchTerm, setSearchTerm] = useState("");

  //Variables para el paginado
  const [pagina, setPagina] = useState(1);
  const [paginaElem] = useState(5);
  const ultimoElem = pagina * paginaElem;
  const primerElem = ultimoElem - paginaElem;
  const paginaActual = usuariosList.slice(primerElem, ultimoElem);
  const paginate = (pageNumber) => setPagina(pageNumber);

  //Variables para el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Links de las API
  const URLUsuarios = "http://localhost:8080/api/usuarios";
  const URLClientes = "http://localhost:8080/api/clientes";
  const URLEmpleados = "http://localhost:8080/api/empleados";
  const URLRoles = "http://localhost:8080/api/roles";
  const URLPermisos = "http://localhost:8080/api/permisos";
  const URLRolesPermisos = "http://localhost:8080/api/rolesxpermisos";

  //Endpoint o métodos get
  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuarios);
      setUsuariosL(resp.data.usuarios);
    } catch (error) {
      showAlert("error", "Error al obtener datos de los usuarios.");
      console.error("Error al obtener datos de los usuarios:", error);
    }
  };

  const getRoles = async () => {
    try {
      const resp = await Axios.get(URLRoles);
      setRolesL(resp.data.roles);
    } catch (error) {
      showAlert("error", "Error al obtener datos de los roles.");
      console.error("Error al obtener datos de los roles:", error);
    }
  };

  const getPermisos = async () => {
    try {
      const resp = await Axios.get(URLPermisos);
      setPermisosL(resp.data.permisos);
    } catch (error) {
      showAlert("error", "Error al obtener datos de los permisos.");
      console.error("Error al obtener datos de los permisos:", error);
    }
  };

  const getRolesPermisos = async () => {
    try {
      const resp = await Axios.get(URLRolesPermisos);
      setRolesPermisosL(resp.data.rolesxpermisos);
    } catch (error) {
      showAlert("error", "Error al obtener datos de los roles-Permisos.");
      console.error("Error al obtener datos de los roles-Permisos:", error);
    }
  };

  //Para cargar los get
  useEffect(() => {
    getRoles();
    getPermisos();
    getRolesPermisos();
    getUsuarios();
  }, []);

  //Función para obtener el usuario por nombre de usuario
  function getUserByUsername() {
    // Consulta para obtener el ID del usuario recién creado
    Axios.get(URLUsuarios + `/${usuario}`).then((response) => {
      const nuevoUsuarioId = response.data.usuario.IdUsuario;
      // Luego de obtener el ID del nuevo usuario, crear el cliente con ese ID
      if (roles == 3) {
        showAlert("success", "Cliente registrado.");
        Axios.post(URLClientes, {
          IdUsuario: nuevoUsuarioId
        }).catch((error) => {
          showAlert("error", "Error al enviar el cliente.");
          console.error("Error al enviar el cliente:", error);
        });
      } else if (roles == 2) {
        showAlert("success", "Empleado registrado.");
        Axios.post(URLEmpleados, {
          IdUsuario: nuevoUsuarioId,
          PorcentajeGanancias: 25,
        }).catch((error) => {
          showAlert("error", "Error al enviar el empleado.");
          console.error("Error al enviar el empleado:", error);
        });
      }
    }).catch((error) => {
      showAlert("error", "Error al obtener el ID del usuario recién creado.");
      console.error("Error al obtener el ID del usuario:", error);
    });
    getUsuarios();
    empty();
  }

  //Variables para marcar errores en los input
  const [errorRol, setErrorRol] = useState(true);
  const [errorUsuario, setErrorUsuario] = useState(true);
  const [errorNombre, setErrorNombre] = useState(true);
  const [errorApellidos, setErrorApellidos] = useState(true);
  const [errorCelular, setErrorCelular] = useState(true);
  const [errorCorreo, setErrorCorreo] = useState(true);
  const [errorPass, setErrorPass] = useState(true);
  const [errorConfirmPass, setErrorConfirmPass] = useState(true);

  //Endpoint o método post
  const postUsuario = () => {
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,25}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,20}$/;
    setErrorRol(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellidos(true);
    setErrorCelular(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    if (roles == 0) {
      showAlert("error", "Seleccione un rol primero!");
      setErrorRol(false);
    } else if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (usuario != usuario.match(valUsu)) {
      showAlert("error", "Ingrese un nombre de usuario válido!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario)) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
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
    } else if (usuariosList.some(user => user.Celular === parseInt(celular))) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
    } else if (!correo) {
      showAlert("error", "Ingrese un correo!");
      setErrorCorreo(false);
    } else if (correo != correo.match(valEm)) {
      showAlert("error", "Ingrese un correo válido!");
      setErrorCorreo(false);
    } else if (usuariosList.map((user) => user.Correo).includes(correo)) {
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
      showAlert("success", "Usuario registrado con éxito!");
      handleClose();
      Axios.post(URLUsuarios, {
        IdRol: roles,
        Usuario: usuario,
        Estado: true,
        Nombre: nombre,
        Apellidos: apellidos,
        Celular: celular,
        Correo: correo,
        Pass: pass,
      }).then(() => {
        getUsuarios();
        getUserByUsername();
      }).catch((error) => {
        showAlert("error", "Error al registrar un usuario.");
        console.error("Error al registrar el usuario:", error);
      });
    }
  }

  // } else if (!valCed.test(cedula)) {

  //Endpoint o método put
  const putUsuario = () => {
    // console.log("Todos: ", usuariosList.some(user => user.Celular === parseInt(celular)))
    // console.log("Todos menos el actual: ", usuariosList.some(user => user.Celular === parseInt(celular) && user.IdUsuario !== id))
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,30}$/;
    setErrorRol(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellidos(true);
    setErrorCelular(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    if (roles == 0) {
      showAlert("error", "Seleccione un rol primero!");
      setErrorRol(false);
    } else if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (usuario != usuario.match(valUsu)) {
      showAlert("error", "Ingrese un nombre de usuario válido!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario) && usuario !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Usuario).toString()) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
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
    } else if (!valCel.test(celular)) {
      showAlert("error", "Ingrese un número de celular válido!");
      setErrorCelular(false);
    } else if (usuariosList.some(user => user.Celular === parseInt(celular) && user.IdUsuario !== id)) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
      return;
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
      showAlert("success", "Usuario actualizado con éxito!");
      scrollToElement();
      handleClose();
      Axios.put(URLUsuarios, {
        IdUsuario: id,
        IdRol: roles,
        Usuario: usuario,
        Estado: true,
        Nombre: nombre,
        Apellidos: apellidos,
        Celular: parseInt(celular),
        Correo: correo,
        Pass: pass,
      }).then(() => {
        getUsuarios();
        empty();
      }).catch((error) => {
        showAlert("error", "error al actualizar el usuario.");
        console.error("Error al actualizar el usuario:", error);
      });
    }
  }

  //Para abrir modal
  const Reg = () => {
    setErrorRol(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellidos(true);
    setErrorCelular(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    setEdit(false);
    handleShow();
  };

  //Para cambiar los input a modo editar
  const Edit = (val) => {
    scrollTop();
    setErrorRol(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellidos(true);
    setErrorCelular(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    setEdit(true);
    handleShow();
    setId(val.IdUsuario);
    setUsuario(val.Usuario);
    setRoles(val.IdRol);
    setNombre(val.Nombre);
    setApellidos(val.Apellidos);
    setCorreo(val.Correo);
    setCelular(val.Celular);
    setPass(val.Pass);
    setConfirmPass("");
  };

  //Variable y función para ver la contraseña
  const [ver, setVer] = useState(true);
  const toggleVer = () => {
    setVer(!ver)
  }

  //Función para vaciar las variables
  const empty = () => {
    setUsuario("");
    setRoles("");
    setNombre("");
    setApellidos("");
    setCelular("");
    setCorreo("");
    setPass("");
    setConfirmPass("");
    setVer(true);
    setEdit(false);
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

  const scrollToElement = () => {
    console.log(document.getElementById(`User${id}`))
    const element = document.getElementById(`User${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="formRegUsu">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Usuario") : ("Crear usuario")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-3 gap-3">
            {edit ? (
              <div className="col-span-">
                <select
                  label="Rol"
                  value={roles}
                  disabled
                  className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                  <option value={0}>Seleccione un rol</option>
                  {rolesList.map((rol) => (
                    <option key={rol.IdRol} value={rol.IdRol}>
                      {rol.NombreDelRol}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="col-span-">
                <select
                  label="Rol"
                  value={roles}
                  onChange={(event) => setRoles(event.target.value)}
                  className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                  <option value={0}>Seleccione un rol</option>
                  {rolesList.map((rol) => (
                    <option key={rol.IdRol} value={rol.IdRol}>
                      {rol.NombreDelRol}
                    </option>
                  ))}
                </select>
              </div>
            )}
            

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
            {edit ? (
              <div>
                <button onClick={volver} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 me-9 rounded">
                  Volver
                </button>
                <button onClick={(e) => {
                  putUsuario();
                }} className="bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">
                  Editar usuario
                </button>
              </div>
            ) : (
              <button onClick={postUsuario} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                Crear usuario
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Usuarios
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Rol", "Usuario", "Estado", "Nombre", "Apellido", "Celular", "Correo", "Editar"].map((el) => (
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
            <tbody id="IdBodyTable">
              {usuariosList.map((user) => (
                <tr key={user.IdUsuario} id={`User${user.IdUsuario}`}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{rolesList.map((rol) => (rol.IdRol == user.IdRol && rol.NombreDelRol))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Usuario}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {user.Estado ? (
                      <button onClick={() => {
                        switchEstado(user.IdUsuario)
                      }} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full">
                        Activo
                      </button>
                    ) : (
                      <button onClick={() => {
                        switchEstado(user.IdUsuario)
                      }} className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full">
                        Inactivo
                      </button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Nombre}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Apellidos}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Celular}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Correo}</td>
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
export default Clientes;