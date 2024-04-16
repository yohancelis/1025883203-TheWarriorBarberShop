import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";


export function SignIn() {
  return (
    <section className="m-8 flex gap-4">
      <div className="w-1/2 lg:w-3/5 flex flex-col justify-center bg-gray-200  rounded-3xl">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mt-5">The Warrior Barber Shop</Typography>
        </div>
        <form className="my-4 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-4">
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
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button fullWidth className="mt-3">
            Ingresar
          </Button>
          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Olvidaste tu contraseña?
              </a>
            </Typography>
          </div>
          <Typography variant="paragraph" className="text-center text-black font-medium mt-4">
            No tengo una cuenta,
            <Link to="/auth/sign-up" className="text-cyan-700 ml-1">Registrarme</Link>
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

export default SignIn;
