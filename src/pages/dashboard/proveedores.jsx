import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input,
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';

//iconos
import {
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

export function Proveedores() {
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

  //se crea la lista en las que se van a guardar los datos
  const [proveedoresList, setProveedoresList] = useState([]);

  //se crean variables en las que se guardan los datos de los input
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  //apis
  const URLProveedores = "http://localhost:8080/api/proveedores";

  //metodos o endpoints get
  const getProveedores = async () => {
    try {
      const resp = await Axios.get(URLProveedores);
      setProveedoresList(resp.data.proveedores);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  useEffect(() => {
    getProveedores();
  }, []);

  //post
  const postProveedor = () => {
    Axios.post(URLProveedores, {
      NombreProveedor: nombreProveedor,
      NombreContacto: nombreContacto,
      Telefono: telefono,
      Correo: correo,
    }).then(() => {
      showAlert("success", "Proveedor registrado con éxito!");
      getProveedores();
      setEdit(false)
      empty();
    }).catch((error) => {
      console.log(error)
    })
  };

  //put
  const putProveedores = () => {
    Axios.put(URLProveedores, {
      IdProveedor: id,
      NombreProveedor: nombreProveedor,
      NombreContacto: nombreContacto,
      Telefono: telefono,
      Correo: correo,
    }).then(() => {
      showAlert("success", "Proveedor actualizado con éxito!");
      getProveedores();
      setEdit(false);
      empty();
    }).catch((error) => {
      console.log(error)
    })
  };

  //llamar las variables 
  const editar = (val) => {
    setEdit(true)
    setId(val.IdProveedor)
    setNombreProveedor(val.NombreProveedor)
    setNombreContacto(val.NombreContacto)
    setTelefono(val.Telefono)
    setCorreo(val.Correo)
  }

  //limpiar campos
  const empty = () => {
    setNombreProveedor("")
    setNombreContacto("")
    setTelefono("")
    setCorreo("")
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Proveedor") : ("Crear Proveedor")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <Input
                label="Nombre del Proveedor"
                value={nombreProveedor}
                onChange={(event) => setNombreProveedor(event.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Nombre del Contacto"
                value={nombreContacto}
                onChange={(event) => setNombreContacto(event.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Teléfono"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                type="number"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Correo"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                type="email"
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            {edit ? (
              <div>
                <button onClick={putProveedores} className="bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">
                  Editar proveedor
                </button>
              </div>
            ) : (
              <button onClick={postProveedor} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear proveedor
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Proveedores
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre Proveedor", "Nombre Contacto", "Teléfono", "Correo", "Funciones"].map((el) => (
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
              {proveedoresList.map((user) => (
                <tr key={user.IdProveedor}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreProveedor}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreContacto}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Telefono}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Correo}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6"><PencilSquareIcon /></button>
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
export default Proveedores;