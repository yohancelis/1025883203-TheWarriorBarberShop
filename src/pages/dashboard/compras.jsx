import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,

} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';
import { PencilSquareIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";


export function Compras() {
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

  const [comprasList, setComprasList] = useState([]);
  const [proveedoresList, setProveedoresList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [total, setTotal] = useState(0);

  const [proveedor, setProveedor] = useState("");
  const [producto, setProducto] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [subTotal, setSubTotal] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  const volver = () => {
    empty();
    setEdit(false);
  }

  const URLCompras = "http://localhost:8080/api/compras";
  const URLProveedores = "http://localhost:8080/api/proveedores";
  const URLGestionProductos = "http://localhost:8080/api/gestionproductos";

  const getCompras = async () => {
    try {
      const resp = await Axios.get(URLCompras);
      setComprasList(resp.data.compras);
    } catch (error) {
      console.log("Error al obtener los datos de compras: ", error);
    }
  }

  const getProveedores = async () => {
    try {
      const resp = await Axios.get(URLProveedores);
      setProveedoresList(resp.data.proveedores); 
    } catch (error) {
      console.log("Error al obtener los datos de proveedores: ", error);
    }
  }

  const getProductos = async () => {
    try {
      const resp = await Axios.get(URLGestionProductos);
      setProductosList(resp.data.gestionproductos);
    } catch (error) {
      console.log("Error al obtener los datos de productos: ", error);
    }
  }

  const empty = () => {
    setProveedor("");
    setProducto("");
    setNumeroFactura("");
    setFechaRegistro("");
    setSubTotal("");
  }

  useEffect(() => {
    getCompras();
    getProveedores();
    getProductos();
  }, []);

  const postCompras = () => {
    if (!proveedor || !producto || !numeroFactura || !fechaRegistro || !subTotal) {
      showAlert("error", "Por favor completa todos los campos");
      return;
    }

    // Agregar productosAgregados a comprasList
    const nuevasCompras = [...comprasList, ...productosAgregados];
    setComprasList(nuevasCompras);

    // Calcular el total
    const totalActual = nuevasCompras.reduce((acc, curr) => acc + parseFloat(curr.SubTotal), 0);
    setTotal(totalActual);

    // Limpiar productosAgregados
    setProductosAgregados([]);

    // Limpiar campos del producto
    empty();
  };

  const editar = (compra) => {
    setEdit(true);
    setId(compra.IdCompra);
    setProveedor(compra.IdProveedor);
    setProducto(compra.IdProducto);
    setNumeroFactura(compra.NumeroFactura);
    setFechaRegistro(compra.FechaRegistro);
    setSubTotal(compra.SubTotal);
  }

  const deleteProducto = (index) => {
    const updatedProductosAgregados = [...productosAgregados];
    updatedProductosAgregados.splice(index, 1);
    setProductosAgregados(updatedProductosAgregados);

    // Calcular el total
    const totalActual = updatedProductosAgregados.reduce((acc, curr) => acc + parseFloat(curr.SubTotal), 0);
    setTotal(totalActual);
  }

  // Función para agregar productos a la lista de productos agregados
  const addProducto = () => {
    if (!proveedor || !producto || !numeroFactura || !fechaRegistro || !subTotal) {
      showAlert("error", "Por favor completa todos los campos");
      return;
    }

    // Crear objeto de producto
    const nuevoProducto = {
      Proveedor: proveedoresList.find(p => p.IdProveedor === parseInt(proveedor))?.NombreProveedor || "",
      Producto: productosList.find(p => p.IdProducto === parseInt(producto))?.NombreProducto || "",
      NumeroFactura: numeroFactura,
      FechaRegistro: fechaRegistro,
      SubTotal: subTotal,
    };

    // Agregar producto a la lista de productos agregados
    setProductosAgregados([...productosAgregados, nuevoProducto]);

    // Calcular el total
    const totalActual = productosAgregados.reduce((acc, curr) => acc + parseFloat(curr.SubTotal), 0) + parseFloat(subTotal);
    setTotal(totalActual);

    // Limpiar campos del producto
    empty();
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar compra") : ("Crear compra")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-">
              <select
                label="Proveedor"
                value={proveedor}
                onChange={(event) => setProveedor(event.target.value)}
                className="text-sm block w-full h-10 border border-gray-400 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value="">Seleccione un proveedor</option>
                {proveedoresList.map((proveedor) => (
                  <option key={proveedor.IdProveedor} value={proveedor.IdProveedor}>
                    {proveedor.NombreProveedor}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-">
              <select
                label="Producto"
                value={producto}
                onChange={(event) => setProducto(event.target.value)}
                className="text-sm block w-full h-10 border border-gray-400 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value="">Seleccione un producto</option>
                {productosList.map((producto) => (
                  <option key={producto.IdProducto} value={producto.IdProducto}>
                    {producto.NombreProducto}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <Input
                label="Numero Factura"
                value={numeroFactura}
                onChange={(event) => setNumeroFactura(event.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Fecha Registro"
                value={fechaRegistro}
                type="date"
                onChange={(event) => setFechaRegistro(event.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="SubTotal"
                value={subTotal}
                onChange={(event) => setSubTotal(event.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            {edit ? (
              <div>
                <button onClick={volver} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 me-9 rounded">
                  Volver
                </button>
                <button onClick={putCompras} className="bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">
                  Editar Compra
                </button>
              </div>
            ) : (
              <div>
                <button onClick={postCompras} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded mr-4">
                  Crear compra
                </button>
                <button onClick={addProducto} className="bg-green-400 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                  Añadir Producto
                </button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      <div className="mt-6">
        <Typography variant="h6">Productos Agregados:</Typography>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numero Factura
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SubTotal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productosAgregados.map((producto, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {producto.Proveedor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {producto.Producto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{producto.NumeroFactura}</td>
                <td className="px-6 py-4 whitespace-nowrap">{producto.FechaRegistro}</td>
                <td className="px-6 py-4 whitespace-nowrap">{producto.SubTotal}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => deleteProducto(index)} className="text-xs font-semibold text-red-600 btnFunciones h-6 w-6"><TrashIcon /></button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td colSpan="4" className="text-right font-bold">Total:</td>
              <td className="px-6 py-4 whitespace-nowrap">{total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Compras
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Proveedor", "Producto", "Numero Factura", "Fecha Registro", "SubTotal" ].map((el) => (
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
              {comprasList.map((compra) => (
                <tr key={compra.IdCompra}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{proveedoresList.find((proveedor) => proveedor.IdProveedor === compra.IdProveedor)?.NombreProveedor}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{productosList.find((producto) => producto.IdProducto === compra.IdProducto)?.NombreProducto}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{compra.NumeroFactura}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{compra.FechaRegistro}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{compra.SubTotal}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={() => editar(compra)} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6"><EyeIcon /></button>
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

export default Compras;
