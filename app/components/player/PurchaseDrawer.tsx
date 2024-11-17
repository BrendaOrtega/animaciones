import { Form } from "@remix-run/react";
import { PrimaryButton } from "../PrimaryButton";
import { Drawer } from "../SimpleDrawer";
import { useState } from "react";

export const PurchaseDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Drawer
      header={<></>}
      cta={<></>}
      className="z-50"
      title="Desbloquea todo el curso"
      isOpen
    >
      <p className="text-xl text-center pt-20 pb-8">
        Recuerda que el código de los componentes es Open Source y puedes{" "}
        <a
          className="text-blue-500 hover:text-blue-600"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/marianaLz/fun-components"
        >
          copiarlos
        </a>{" "}
        libremente para tus proyectos. 😎
      </p>
      <p className="text-2xl text-center">
        Puedes seguir mirando, y construir conmigo todos los componentes paso a
        paso. <br />
        ¡Desbloquea el curso completo! 🫶🏻
      </p>
      <p className="text-xl text-center pt-20 pb-8">
        Si estás aquí justo después de tu compra, no olvides revisar tu bandeja
        de spam, para encontrar tu acceso. 😅
      </p>
      <Form method="POST">
        <PrimaryButton
          // auto loading
          onClick={() => setIsLoading(true)}
          isLoading={isLoading}
          name="intent"
          value="checkout"
          type="submit"
          className="font-bold w-full mt-20 hover:tracking-wide"
        >
          ¡Que siga la magia! 🎩🪄
        </PrimaryButton>
      </Form>
    </Drawer>
  );
};
