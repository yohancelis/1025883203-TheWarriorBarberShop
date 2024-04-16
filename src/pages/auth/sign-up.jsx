import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignUp() {
  return (
    <section className="m-8 flex gap-4">
    <div className="w-1/2 lg:w-3/5 flex flex-col justify-center bg-gray-200  rounded-3xl">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mt-5">Registro</Typography>
        </div>
        <form className="mt-5 mb-2 grid grid-cols-2 mx-auto max-w-screen-lg">
          <div className="mb-3 flex flex-col col-span-2 gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Usuario
            </Typography>
            <Input
              size="lg"
              placeholder="Nombre de usuario"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-3 me-2 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Nombre
            </Typography>
            <Input
              size="lg"
              placeholder="Nombre"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-3 ms-2 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Apellido
            </Typography>
            <Input
              size="lg"
              placeholder="Apellido"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-3 me-2 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Celular
            </Typography>
            <Input
              size="lg"
              placeholder="celular"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-3 ms-2 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Correo
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-3 me-2 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              size="lg"
              placeholder="*********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-3 ms-2 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Confirmar contraseña
            </Typography>
            <Input
              size="lg"
              placeholder="*********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button fullWidth className="mb-3 col-span-2 bg-black">
            Registrarme
          </Button>
          <Typography variant="paragraph" className="text-center text-black font-medium mt-2">
            Ya tengo una cuenta,
            <Link to="/auth/sign-in" className="text-cyan-700 ml-1">Iniciar Sesión</Link>
          </Typography>
        </form>
      </div>
      <div className="w-1/2 h-full hidden lg:block">
        <img
          src="/img/logo-login-black.png"
          className="h-full w-full object-cover rounded-3xl  lg:w"
        />
      </div>
    </section>
  );
}

export default SignUp;
