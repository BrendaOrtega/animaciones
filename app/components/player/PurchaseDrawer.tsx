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
      <div className="pt-20 px-8  pb-8">
        <h3 className="text-4xl text-white">
          ¿List@ para crear animaciones? Prepárate porque apenas estamos
          comenzando 🚀🧙🏻
        </h3>
        <p className="text-xl font-light mt-16 text-metal">
          ¡Desbloquea el curso completo! 🫶🏻 Construye conmigo todos los
          componentes paso a paso y conviértete en un@ PRO de las animaciones.{" "}
          <br />
        </p>
        <p className="text-xl mt-4 text-metal font-light">
          Recuerda que el código de los componentes es Open Source y puedes{" "}
          {/* <a
            className="text-fish hover:text-blue-600"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/marianaLz/fun-components"
          > */}
          <span className="text-fish"> copiarlos</span>
          {/* </a>{" "} */} libremente y empezar a usarlos en tus proyectos. 😎
        </p>
        <p className="text-xl mt-4 text-metal font-light">
          Si estás aquí justo después de tu compra, no olvides revisar tu
          bandeja de spam, para encontrar tu acceso. 😅
        </p>
        <Form method="POST">
          <PrimaryButton
            // auto loading
            onClick={() => setIsLoading(true)}
            isLoading={isLoading}
            name="intent"
            value="checkout"
            type="submit"
            className="font-semibold w-full mt-20 hover:tracking-wide"
          >
            ¡Que siga la magia! 🎩🪄
          </PrimaryButton>
        </Form>{" "}
      </div>
    </Drawer>
  );
};
