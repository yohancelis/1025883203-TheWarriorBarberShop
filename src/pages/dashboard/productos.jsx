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

export function Productos() {
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
  const [productosList, setProductosList] = useState([]);

  //se crean variables en las que se guardan los datos de los input
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stockMax, setStockMax] = useState("");
  const [stockMin, setStockMin] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  //apis
  const URLProductos = "http://localhost:8080/api/gestionproductos";

  //metodos o endpoints get
  const getProductos = async () => {
    try {
      const resp = await Axios.get(URLProductos);
      setProductosList(resp.data.gestionproductos);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  useEffect(() => {
    getProductos();
  }, []);

  //post
  const postProducto = () => {
    Axios.post(URLProductos, {
      NombreProducto: nombreProducto,
      Descripcion: descripcion,
      StockMax: stockMax,
      StockMin: stockMin,
      CantidadDisponible: cantidadDisponible,
      PrecioUnitario: precioUnitario,
    }).then(() => {
      showAlert("success", "Producto registrado con éxito!");
      getProductos();
      setEdit(false)
      empty();
    }).catch((error) => {
      console.log(error)
    })
  };

  //put
  const putProductos = () => {
    Axios.put(URLProductos, {
      IdProducto: id,
      NombreProducto: nombreProducto,
      Descripcion: descripcion,
      StockMax: stockMax,
      StockMin: stockMin,
      CantidadDisponible: cantidadDisponible,
      PrecioUnitario: precioUnitario,
    }).then(() => {
      showAlert("success", "Producto actualizado con éxito!");
      getProductos();
      setEdit(false);
      empty();
    }).catch((error) => {
      console.log(error)
    })
  };

  //llamar las variables 
  const editar = (val) => {
    setEdit(true)
    setId(val.IdProducto)
    setNombreProducto(val.NombreProducto)
    setDescripcion(val.Descripcion)
    setStockMax(val.StockMax)
    setStockMin(val.StockMin)
    setCantidadDisponible(val.CantidadDisponible)
    setPrecioUnitario(val.PrecioUnitario)
  }

  //limpiar campos
  const empty = () => {
    setNombreProducto("")
    setDescripcion("")
    setStockMax("")
    setStockMin("")
    setCantidadDisponible("")
    setPrecioUnitario("")
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Producto") : ("Crear Producto")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <Input
                label="Nombre del Producto"
                value={nombreProducto}
                onChange={(event) => setNombreProducto(event.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Descripción"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Stock Máximo"
                value={stockMax}
                onChange={(event) => setStockMax(event.target.value)}
                type="number"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Stock Mínimo"
                value={stockMin}
                onChange={(event) => setStockMin(event.target.value)}
                type="number"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Cantidad Disponible"
                value={cantidadDisponible}
                onChange={(event) => setCantidadDisponible(event.target.value)}
                type="number"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Precio Unitario"
                value={precioUnitario}
                onChange={(event) => setPrecioUnitario(event.target.value)}
                type="number"
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            {edit ? (
              <div>
                <button onClick={putProductos} className="bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">
                  Editar Producto
                </button>
              </div>
            ) : (
              <button onClick={postProducto} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear Producto
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Productos
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre Producto", "Descripción", "Stock Max", "Stock Min", "Cantidad Disponible", "Precio Unitario", "Funciones"].map((el) => (
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
              {productosList.map((product) => (
                <tr key={product.IdProducto}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{product.NombreProducto}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{product.Descripcion}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{product.StockMax}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{product.StockMin}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{product.CantidadDisponible}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{product.PrecioUnitario}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={() => { editar(product) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6"><PencilSquareIcon /></button>
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
export default Productos;